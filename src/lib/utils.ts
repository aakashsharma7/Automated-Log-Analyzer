import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

export function formatDuration(milliseconds: number) {
  if (milliseconds < 1000) return `${milliseconds}ms`
  if (milliseconds < 60000) return `${(milliseconds / 1000).toFixed(1)}s`
  if (milliseconds < 3600000) return `${(milliseconds / 60000).toFixed(1)}m`
  return `${(milliseconds / 3600000).toFixed(1)}h`
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

export function formatPercentage(value: number, total: number): string {
  if (total === 0) return '0%'
  return ((value / total) * 100).toFixed(1) + '%'
}

export function getStatusColor(statusCode: number): string {
  if (statusCode >= 200 && statusCode < 300) return 'text-green-400'
  if (statusCode >= 300 && statusCode < 400) return 'text-blue-400'
  if (statusCode >= 400 && statusCode < 500) return 'text-yellow-400'
  if (statusCode >= 500) return 'text-red-400'
  return 'text-gray-400'
}

export function getLevelColor(level: string): string {
  switch (level?.toUpperCase()) {
    case 'ERROR':
      return 'text-red-400'
    case 'WARNING':
      return 'text-yellow-400'
    case 'INFO':
      return 'text-blue-400'
    case 'DEBUG':
      return 'text-gray-400'
    default:
      return 'text-gray-400'
  }
}

export function getAnomalyTypeColor(type: string): string {
  switch (type) {
    case 'error_spike':
      return 'text-red-400'
    case 'unusual_time':
      return 'text-yellow-400'
    case 'large_response':
      return 'text-orange-400'
    case 'suspicious_ip':
      return 'text-purple-400'
    case 'potential_sql_injection':
      return 'text-red-500'
    case 'unusual_request':
      return 'text-blue-400'
    default:
      return 'text-gray-400'
  }
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

export function extractIpAddress(text: string): string | null {
  const ipPattern = /\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/
  const match = text.match(ipPattern)
  return match ? match[0] : null
}

export function extractTimestamp(text: string): Date | null {
  const timestampPatterns = [
    /(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})/,
    /(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})/,
    /(\d{2}\/\w{3}\/\d{4}:\d{2}:\d{2}:\d{2})/,
    /(\w{3} \d{1,2} \d{2}:\d{2}:\d{2})/
  ]

  for (const pattern of timestampPatterns) {
    const match = text.match(pattern)
    if (match) {
      try {
        return new Date(match[1])
      } catch {
        continue
      }
    }
  }

  return null
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

export function isValidUrl(string: string): boolean {
  try {
    new URL(string)
    return true
  } catch (_) {
    return false
  }
}

export function sanitizeHtml(html: string): string {
  return html
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}

export function parseJsonSafely<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json)
  } catch {
    return fallback
  }
}

export function groupBy<T, K extends keyof T>(
  array: T[],
  key: K
): Record<string, T[]> {
  return array.reduce((groups, item) => {
    const group = String(item[key])
    groups[group] = groups[group] || []
    groups[group].push(item)
    return groups
  }, {} as Record<string, T[]>)
}

export function sortBy<T>(
  array: T[],
  key: keyof T,
  direction: 'asc' | 'desc' = 'asc'
): T[] {
  return [...array].sort((a, b) => {
    const aVal = a[key]
    const bVal = b[key]
    
    if (aVal < bVal) return direction === 'asc' ? -1 : 1
    if (aVal > bVal) return direction === 'asc' ? 1 : -1
    return 0
  })
}

export function calculatePercentile(data: number[], percentile: number): number {
  const sorted = [...data].sort((a, b) => a - b)
  const index = (percentile / 100) * (sorted.length - 1)
  
  if (Number.isInteger(index)) {
    return sorted[index]
  }
  
  const lower = Math.floor(index)
  const upper = Math.ceil(index)
  const weight = index - lower
  
  return sorted[lower] * (1 - weight) + sorted[upper] * weight
}

export function calculateMovingAverage(data: number[], window: number): number[] {
  const result: number[] = []
  
  for (let i = 0; i < data.length; i++) {
    const start = Math.max(0, i - window + 1)
    const slice = data.slice(start, i + 1)
    const average = slice.reduce((sum, val) => sum + val, 0) / slice.length
    result.push(average)
  }
  
  return result
}
