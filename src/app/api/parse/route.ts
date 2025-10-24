import { NextRequest, NextResponse } from 'next/server'
import { LogParser } from '@/lib/log-parser'
import { DataProcessor } from '@/lib/data-processor'
import { prisma } from '@/lib/db'

const parser = new LogParser()
const processor = new DataProcessor()

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]
    const content = formData.get('content') as string
    const format = formData.get('format') as string

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

    // Store logs in database (optional)
    try {
      if (parsedLogs.length > 0) {
        await prisma.log.createMany({
          data: parsedLogs.map(log => ({
            timestamp: log.timestamp,
            level: log.level,
            source: log.source,
            message: log.message,
            ipAddress: log.ipAddress,
            statusCode: log.statusCode,
            responseSize: log.responseSize,
            userAgent: log.userAgent,
            method: log.method,
            url: log.url,
            protocol: log.protocol,
            hostname: log.hostname,
            service: log.service,
            rawLog: log.rawLog,
            jsonData: log.jsonData
          }))
        })
      }
    } catch (dbError) {
      console.warn('Failed to store logs in database:', dbError)
      // Continue without database storage
    }

    // Prepare response
    const response = {
      rows: parsedLogs.length,
      columns: parsedLogs.length > 0 ? Object.keys(parsedLogs[0]) : [],
      sample: parsedLogs.slice(0, 20),
      stats: analysis
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Parse API error:', error)
    return NextResponse.json(
      { error: 'Failed to parse logs' },
      { status: 500 }
    )
  }
}
