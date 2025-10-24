import { NextRequest, NextResponse } from 'next/server'
import { LogParser } from '@/lib/log-parser'
import { DataProcessor } from '@/lib/data-processor'
import { AiAnalysisService } from '@/lib/ai-analysis'
import { prisma } from '@/lib/db'

const parser = new LogParser()
const processor = new DataProcessor()
const aiService = new AiAnalysisService()

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]
    const content = formData.get('content') as string
    const format = formData.get('format') as string
    const model = (formData.get('model') as string) || 'openai'

    // Collect all log lines
    const logLines: string[] = []

    // Process uploaded files
    for (const file of files) {
      if (file.size > 0) {
        const text = await file.text()
        logLines.push(...text.split('\n'))
      }
    }

    // Process pasted content
    if (content && content.trim()) {
      logLines.push(...content.split('\n'))
    }

    if (!logLines.length) {
      return NextResponse.json(
        { error: 'No log content provided' },
        { status: 400 }
      )
    }

    // Parse logs
    const logFormat = format && format !== 'auto' ? format : undefined
    const parsedLogs = parser.parseLogs(logLines, logFormat)

    // Process logs for analysis
    const analysis = processor.processLogs(parsedLogs)

    // Get AI recommendations
    const startTime = Date.now()
    const aiRecommendations = await aiService.analyzeLogsWithAI(parsedLogs, analysis, model as 'openai' | 'gemini')
    const processingTime = Date.now() - startTime

    // Store AI analysis in database (optional)
    try {
      if (parsedLogs.length > 0) {
        await prisma.aiAnalysis.create({
          data: {
            analysisType: 'recommendation',
            prompt: `Analyze ${parsedLogs.length} log entries for issues and recommendations`,
            response: JSON.stringify(aiRecommendations),
            model: model,
            confidence: parseFloat(aiRecommendations.confidence === 'High' ? '0.9' : aiRecommendations.confidence === 'Medium' ? '0.7' : '0.5'),
            processingTime: processingTime
          }
        })
      }
    } catch (dbError) {
      console.warn('Failed to store AI analysis in database:', dbError)
      // Continue without database storage
    }

    return NextResponse.json({
      ai_recommendations: aiRecommendations,
      context: {
        error_summary: {
          total_logs: analysis.basicStats.totalLogs,
          error_rate: analysis.basicStats.errorRate || 0,
          top_errors: analysis.errorAnalysis.errorStatusCodes || {},
          patterns: analysis.basicStats.levelDistribution || {}
        },
        sample_errors: parsedLogs
          .filter(log => log.message && (
            log.message.toLowerCase().includes('error') ||
            log.message.toLowerCase().includes('fail') ||
            log.message.toLowerCase().includes('exception')
          ))
          .slice(0, 5)
          .map(log => log.message),
        pattern_recommendations: analysis.recommendations.slice(0, 3)
      }
    })
  } catch (error) {
    console.error('AI analysis API error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze logs with AI' },
      { status: 500 }
    )
  }
}
