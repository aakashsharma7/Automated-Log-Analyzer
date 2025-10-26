import OpenAI from 'openai'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { LogEntry, LogAnalysis, AiRecommendations } from '@/types'

export class AiAnalysisService {
  private openai: OpenAI | null = null
  private gemini: GoogleGenerativeAI | null = null

  constructor() {
    // Initialize OpenAI
    if (process.env.OPENAI_API_KEY) {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
      })
    }

    // Initialize Gemini
    if (process.env.GEMINI_API_KEY) {
      this.gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    }
  }

  async analyzeLogsWithAI(
    logs: LogEntry[],
    analysis: LogAnalysis,
    model: 'openai' | 'gemini' = 'openai'
  ): Promise<AiRecommendations> {
    const prompt = this.buildAnalysisPrompt(logs, analysis)

    try {
      if (model === 'openai' && this.openai) {
        return await this.analyzeWithOpenAI(prompt)
      } else if (model === 'gemini' && this.gemini) {
        return await this.analyzeWithGemini(prompt)
      } else {
        return this.generateFallbackRecommendations(analysis)
      }
    } catch (error) {
      console.error('AI analysis failed:', error)
      return this.generateFallbackRecommendations(analysis)
    }
  }

  private buildAnalysisPrompt(logs: LogEntry[], analysis: LogAnalysis): string {
    const errorSummary = {
      totalLogs: analysis.basicStats.totalLogs,
      errorRate: analysis.basicStats.errorRate || 0,
      topErrors: analysis.errorAnalysis.errorStatusCodes || {},
      patterns: analysis.basicStats.levelDistribution || {}
    }

    const errorMessages = logs
      .filter(log => log.message && (
        log.message.toLowerCase().includes('error') ||
        log.message.toLowerCase().includes('fail') ||
        log.message.toLowerCase().includes('exception') ||
        log.message.toLowerCase().includes('timeout')
      ))
      .slice(0, 10)
      .map(log => log.message)

    const recommendations = analysis.recommendations.slice(0, 3)

    return `
Analyze these log errors and provide specific, actionable fix recommendations:

Log Summary:
- Total logs: ${errorSummary.totalLogs}
- Error rate: ${errorSummary.errorRate.toFixed(1)}%
- Top HTTP errors: ${JSON.stringify(errorSummary.topErrors)}
- Log levels: ${JSON.stringify(errorSummary.patterns)}

Sample error messages:
${errorMessages.join('\n')}

Current recommendations from pattern analysis:
${recommendations.map(r => `${r.reason}: ${r.advice}`).join('\n')}

Please provide a JSON response with the following structure:
{
  "root_cause": "Brief description of the root cause",
  "fix_steps": ["Step 1", "Step 2", "Step 3"],
  "prevention": ["Prevention strategy 1", "Prevention strategy 2"],
  "monitoring": ["Monitoring recommendation 1", "Monitoring recommendation 2"],
  "references": ["https://example.com/doc1", "https://example.com/doc2"],
  "confidence": "High|Medium|Low"
}

Focus on:
1. Root cause analysis
2. Specific fix steps with commands/configs
3. Prevention strategies
4. Monitoring recommendations
5. References to relevant documentation
`
  }

  private async analyzeWithOpenAI(prompt: string): Promise<AiRecommendations> {
    if (!this.openai) throw new Error('OpenAI not initialized')

    const response = await this.openai.chat.completions.create({
      model: process.env.AI_MODEL_OPENAI || 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert DevOps engineer and log analysis specialist. Analyze log data and provide actionable recommendations for fixing issues.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: parseInt(process.env.AI_MAX_TOKENS || '4000'),
      temperature: parseFloat(process.env.AI_TEMPERATURE || '0.3')
    })

    const content = response.choices[0]?.message?.content
    if (!content) throw new Error('No response from OpenAI')

    try {
      const parsed = JSON.parse(content)
      return this.validateAiResponse(parsed)
    } catch {
      // If JSON parsing fails, try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[0])
          return this.validateAiResponse(parsed)
        } catch {
          throw new Error('Failed to parse AI response as JSON')
        }
      }
      throw new Error('No valid JSON found in AI response')
    }
  }

  private async analyzeWithGemini(prompt: string): Promise<AiRecommendations> {
    if (!this.gemini) throw new Error('Gemini not initialized')

    const model = this.gemini.getGenerativeModel({ 
      model: process.env.AI_MODEL_GEMINI || 'gemini-pro' 
    })

    const result = await model.generateContent(prompt)
    const response = await result.response
    const content = response.text()

    if (!content) throw new Error('No response from Gemini')

    try {
      const parsed = JSON.parse(content)
      return this.validateAiResponse(parsed)
    } catch {
      // If JSON parsing fails, try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[0])
          return this.validateAiResponse(parsed)
        } catch {
          throw new Error('Failed to parse AI response as JSON')
        }
      }
      throw new Error('No valid JSON found in AI response')
    }
  }

  private validateAiResponse(response: any): AiRecommendations {
    return {
      rootCause: response.root_cause || 'Unable to determine root cause',
      fixSteps: Array.isArray(response.fix_steps) ? response.fix_steps : [],
      prevention: Array.isArray(response.prevention) ? response.prevention : [],
      monitoring: Array.isArray(response.monitoring) ? response.monitoring : [],
      references: Array.isArray(response.references) ? response.references : [],
      confidence: response.confidence || 'Medium'
    }
  }

  private generateFallbackRecommendations(analysis: LogAnalysis): AiRecommendations {
    const recommendations = analysis.recommendations.slice(0, 5)
    
    return {
      rootCause: 'Multiple issues detected based on log patterns',
      fixSteps: recommendations.map(r => r.advice),
      prevention: [
        'Implement comprehensive error logging and monitoring',
        'Set up automated health checks and alerts',
        'Use blue-green deployments to reduce downtime',
        'Implement circuit breakers for external dependencies',
        'Add input validation and sanitization'
      ],
      monitoring: [
        'Set up APM (Application Performance Monitoring)',
        'Configure log aggregation and analysis tools',
        'Implement real-time alerting for error thresholds',
        'Create dashboards for key performance metrics',
        'Set up automated log rotation and archival'
      ],
      references: [
        'https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/',
        'https://www.postgresql.org/docs/current/monitoring.html',
        'https://docs.oracle.com/javase/tutorial/garbage/',
        'https://httpstatuses.com/500',
        'https://httpstatuses.com/400'
      ],
      confidence: 'Medium'
    }
  }

  async generateLogSummary(logs: LogEntry[]): Promise<string> {
    if (!logs.length) return 'No logs to summarize'

    const summary = {
      totalLogs: logs.length,
      timeRange: {
        start: logs[0].timestamp,
        end: logs[logs.length - 1].timestamp
      },
      errorCount: logs.filter(log => log.level === 'ERROR').length,
      warningCount: logs.filter(log => log.level === 'WARNING').length,
      uniqueSources: new Set(logs.map(log => log.source)).size,
      uniqueIps: new Set(logs.map(log => log.ipAddress)).size
    }

    const prompt = `
Summarize these log data in a concise, executive-friendly format:

Total logs: ${summary.totalLogs}
Time range: ${summary.timeRange.start} to ${summary.timeRange.end}
Errors: ${summary.errorCount}
Warnings: ${summary.warningCount}
Unique sources: ${summary.uniqueSources}
Unique IPs: ${summary.uniqueIps}

Provide a 2-3 sentence summary suitable for executive reporting.
`

    try {
      if (this.openai) {
        const response = await this.openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 200,
          temperature: 0.3
        })
        return response.choices[0]?.message?.content || 'Unable to generate summary'
      }
    } catch (error) {
      console.error('Failed to generate AI summary:', error)
    }

    return `Analysis of ${summary.totalLogs} logs from ${summary.timeRange.start} to ${summary.timeRange.end}. Found ${summary.errorCount} errors and ${summary.warningCount} warnings across ${summary.uniqueSources} sources and ${summary.uniqueIps} unique IP addresses.`
  }

  async explainAnomaly(anomaly: LogEntry): Promise<string> {
    const prompt = `
Explain why this log entry might be considered an anomaly:

Timestamp: ${anomaly.timestamp}
Level: ${anomaly.level}
Source: ${anomaly.source}
Message: ${anomaly.message}
IP Address: ${anomaly.ipAddress}
Status Code: ${anomaly.statusCode}
Response Size: ${anomaly.responseSize}

Provide a brief explanation of what makes this entry anomalous and potential implications.
`

    try {
      if (this.openai) {
        const response = await this.openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 300,
          temperature: 0.3
        })
        return response.choices[0]?.message?.content || 'Unable to explain anomaly'
      }
    } catch (error) {
      console.error('Failed to explain anomaly:', error)
    }

    return `This log entry shows unusual patterns that deviate from normal system behavior. The anomaly may indicate potential issues requiring investigation.`
  }
}
