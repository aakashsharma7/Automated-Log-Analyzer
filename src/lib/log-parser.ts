import { LogEntry, LogFormat } from '@/types'

export class LogParser {
  private patterns: Record<string, RegExp>

  constructor() {
    this.patterns = {
      apache: /(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}) - - \[(.*?)\] "(.*?)" (\d{3}) (\d+)/,
      nginx: /(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}) - - \[(.*?)\] "(.*?)" (\d{3}) (\d+)/,
      syslog: /(\w{3}\s+\d{1,2}\s+\d{2}:\d{2}:\d{2})\s+(\S+)\s+(\S+):\s+(.*)/,
      json: /\{.*\}/,
      custom: /(.*)/
    }
  }

  detectLogFormat(logLines: string[]): string {
    if (!logLines.length) return 'custom'

    const sampleSize = Math.min(10, logLines.length)
    const sampleLines = logLines.slice(0, sampleSize)

    // Check for JSON format
    const jsonCount = sampleLines.filter(line => this.isJsonLine(line.trim())).length
    if (jsonCount / sampleSize > 0.5) return 'json'

    // Check for Apache/Nginx format
    let apacheCount = 0
    let nginxCount = 0
    let syslogCount = 0

    for (const line of sampleLines) {
      if (this.patterns.apache.test(line.trim())) {
        apacheCount++
      } else if (this.patterns.nginx.test(line.trim())) {
        nginxCount++
      } else if (this.patterns.syslog.test(line.trim())) {
        syslogCount++
      }
    }

    if (apacheCount > nginxCount && apacheCount > syslogCount) return 'apache'
    if (nginxCount > apacheCount && nginxCount > syslogCount) return 'nginx'
    if (syslogCount > apacheCount && syslogCount > nginxCount) return 'syslog'

    return 'custom'
  }

  private isJsonLine(line: string): boolean {
    try {
      JSON.parse(line)
      return true
    } catch {
      return false
    }
  }

  parseLogs(logLines: string[], logFormat?: string): LogEntry[] {
    if (!logLines.length) return []

    const format = logFormat || this.detectLogFormat(logLines)
    const parsedLogs: LogEntry[] = []

    for (const line of logLines) {
      if (!line.trim()) continue

      try {
        let parsedLog: LogEntry

        switch (format) {
          case 'apache':
            parsedLog = this.parseApacheLog(line)
            break
          case 'nginx':
            parsedLog = this.parseNginxLog(line)
            break
          case 'syslog':
            parsedLog = this.parseSyslog(line)
            break
          case 'json':
            parsedLog = this.parseJsonLog(line)
            break
          default:
            parsedLog = this.parseCustomLog(line)
        }

        parsedLogs.push(parsedLog)
      } catch (error) {
        console.warn(`Failed to parse log line: ${error}`)
        parsedLogs.push(this.createDefaultLogEntry(line))
      }
    }

    return parsedLogs
  }

  private parseApacheLog(line: string): LogEntry {
    const match = line.trim().match(this.patterns.apache)
    if (!match) return this.createDefaultLogEntry(line)

    const [, ip, timestampStr, request, statusCode, responseSize] = match

    const timestamp = this.parseApacheTimestamp(timestampStr)
    const { method, url, protocol } = this.parseRequest(request)

    return {
      timestamp,
      ipAddress: ip,
      method,
      url,
      protocol,
      statusCode: parseInt(statusCode),
      responseSize: parseInt(responseSize),
      level: this.getLogLevelFromStatus(parseInt(statusCode)),
      source: 'apache',
      message: `${method} ${url} ${statusCode}`,
      rawLog: line
    }
  }

  private parseNginxLog(line: string): LogEntry {
    const match = line.trim().match(this.patterns.nginx)
    if (!match) return this.createDefaultLogEntry(line)

    const [, ip, timestampStr, request, statusCode, responseSize] = match

    const timestamp = this.parseNginxTimestamp(timestampStr)
    const { method, url, protocol } = this.parseRequest(request)

    return {
      timestamp,
      ipAddress: ip,
      method,
      url,
      protocol,
      statusCode: parseInt(statusCode),
      responseSize: parseInt(responseSize),
      level: this.getLogLevelFromStatus(parseInt(statusCode)),
      source: 'nginx',
      message: `${method} ${url} ${statusCode}`,
      rawLog: line
    }
  }

  private parseSyslog(line: string): LogEntry {
    const match = line.trim().match(this.patterns.syslog)
    if (!match) return this.createDefaultLogEntry(line)

    const [, timestampStr, hostname, service, message] = match

    const timestamp = this.parseSyslogTimestamp(timestampStr)
    const level = this.extractLogLevelFromMessage(message)

    return {
      timestamp,
      hostname,
      service,
      level,
      source: 'syslog',
      message,
      rawLog: line
    }
  }

  private parseJsonLog(line: string): LogEntry {
    try {
      const logData = JSON.parse(line.trim())

      const timestamp = this.extractTimestampFromJson(logData)
      const level = (logData.level || logData.severity || 'INFO').toUpperCase()
      const message = logData.message || logData.msg || JSON.stringify(logData)
      const source = logData.source || logData.service || 'json'

      return {
        timestamp,
        level,
        source,
        message,
        rawLog: line,
        jsonData: logData
      }
    } catch (error) {
      console.warn(`Failed to parse JSON log: ${error}`)
      return this.createDefaultLogEntry(line)
    }
  }

  private parseCustomLog(line: string): LogEntry {
    const timestamp = this.extractTimestampFromText(line)
    const level = this.extractLogLevelFromMessage(line)
    const ipAddress = this.extractIpAddress(line)

    return {
      timestamp,
      level,
      source: 'custom',
      message: line.trim(),
      ipAddress,
      rawLog: line
    }
  }

  private createDefaultLogEntry(line: string): LogEntry {
    return {
      timestamp: new Date(),
      level: 'UNKNOWN',
      source: 'unknown',
      message: line.trim(),
      rawLog: line
    }
  }

  private parseApacheTimestamp(timestampStr: string): Date {
    try {
      // Apache format: [25/Dec/2023:10:30:45 +0000]
      const cleanTimestamp = timestampStr.replace(/[\[\]]/g, '')
      return new Date(cleanTimestamp)
    } catch {
      return new Date()
    }
  }

  private parseNginxTimestamp(timestampStr: string): Date {
    try {
      // Nginx format: [25/Dec/2023:10:30:45 +0000]
      const cleanTimestamp = timestampStr.replace(/[\[\]]/g, '')
      return new Date(cleanTimestamp)
    } catch {
      return new Date()
    }
  }

  private parseSyslogTimestamp(timestampStr: string): Date {
    try {
      // Syslog format: Dec 25 10:30:45
      const currentYear = new Date().getFullYear()
      const fullTimestamp = `${currentYear} ${timestampStr}`
      return new Date(fullTimestamp)
    } catch {
      return new Date()
    }
  }

  private parseRequest(request: string): { method: string; url: string; protocol: string } {
    const parts = request.split(' ')
    if (parts.length >= 3) {
      return { method: parts[0], url: parts[1], protocol: parts[2] }
    } else if (parts.length === 2) {
      return { method: parts[0], url: parts[1], protocol: 'HTTP/1.1' }
    } else {
      return { method: 'GET', url: '/', protocol: 'HTTP/1.1' }
    }
  }

  private getLogLevelFromStatus(statusCode: number): string {
    if (statusCode >= 200 && statusCode < 300) return 'INFO'
    if (statusCode >= 300 && statusCode < 400) return 'INFO'
    if (statusCode >= 400 && statusCode < 500) return 'WARNING'
    if (statusCode >= 500 && statusCode < 600) return 'ERROR'
    return 'UNKNOWN'
  }

  private extractLogLevelFromMessage(message: string): string {
    const messageUpper = message.toUpperCase()
    if (messageUpper.includes('ERROR') || messageUpper.includes('ERR')) return 'ERROR'
    if (messageUpper.includes('WARNING') || messageUpper.includes('WARN')) return 'WARNING'
    if (messageUpper.includes('INFO')) return 'INFO'
    if (messageUpper.includes('DEBUG')) return 'DEBUG'
    return 'INFO'
  }

  private extractTimestampFromJson(logData: Record<string, any>): Date {
    const timestampFields = ['timestamp', 'time', 'datetime', 'created_at', 'date']

    for (const field of timestampFields) {
      if (logData[field]) {
        try {
          const timestampValue = logData[field]
          if (typeof timestampValue === 'number') {
            return new Date(timestampValue * 1000) // Convert Unix timestamp
          } else if (typeof timestampValue === 'string') {
            return new Date(timestampValue)
          }
        } catch {
          continue
        }
      }
    }

    return new Date()
  }

  private extractTimestampFromText(text: string): Date {
    const timestampPatterns = [
      /\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/,
      /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/,
      /\d{2}\/\w{3}\/\d{4}:\d{2}:\d{2}:\d{2}/,
      /\w{3} \d{1,2} \d{2}:\d{2}:\d{2}/
    ]

    for (const pattern of timestampPatterns) {
      const match = text.match(pattern)
      if (match) {
        try {
          return new Date(match[0])
        } catch {
          continue
        }
      }
    }

    return new Date()
  }

  private extractIpAddress(text: string): string | null {
    const ipPattern = /\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/
    const match = text.match(ipPattern)
    return match ? match[0] : null
  }
}
