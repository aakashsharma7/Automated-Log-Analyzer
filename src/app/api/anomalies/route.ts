import { NextRequest, NextResponse } from 'next/server'
import { LogParser } from '@/lib/log-parser'
import { AnomalyDetector } from '@/lib/anomaly-detector'
import { prisma } from '@/lib/db'

const parser = new LogParser()

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]
    const content = formData.get('content') as string
    const contamination = parseFloat(formData.get('contamination') as string) || 0.1
    const threshold = formData.get('threshold') as string

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
    const parsedLogs = parser.parseLogs(logLines)

    // Initialize anomaly detector
    const detector = new AnomalyDetector(contamination)
    
    // Fit the model
    detector.fit(parsedLogs)

    // Detect anomalies
    const thresholdValue = threshold ? parseFloat(threshold) : undefined
    const result = detector.detectAnomalies(parsedLogs, thresholdValue)

    // Store anomalies in database (optional)
    try {
      if (result.anomalies.length > 0) {
        // First, store the log entries
        const storedLogs = await prisma.log.createMany({
          data: result.anomalies.map(log => ({
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
          })),
          skipDuplicates: true
        })

        // Then store the anomaly records
        const logIds = await prisma.log.findMany({
          where: {
            rawLog: { in: result.anomalies.map(log => log.rawLog) }
          },
          select: { id: true, rawLog: true }
        })

        const anomalyData = result.anomalies.map(anomaly => {
          const logId = logIds.find(l => l.rawLog === anomaly.rawLog)?.id
          return {
            logId: logId || 0,
            anomalyScore: (anomaly as any).anomalyScore || 0,
            anomalyType: (anomaly as any).anomalyType || 'unknown'
          }
        }).filter(a => a.logId > 0)

        if (anomalyData.length > 0) {
          await prisma.anomaly.createMany({
            data: anomalyData
          })
        }
      }
    } catch (dbError) {
      console.warn('Failed to store anomalies in database:', dbError)
      // Continue without database storage
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Anomaly detection API error:', error)
    return NextResponse.json(
      { error: 'Failed to detect anomalies' },
      { status: 500 }
    )
  }
}
