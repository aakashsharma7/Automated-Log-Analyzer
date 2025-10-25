'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LogEntry } from '@/types'
import { getStatusColor, getLevelColor, truncateText } from '@/lib/utils'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

interface LogTableProps {
  logs: LogEntry[]
}

export function LogTable({ logs }: LogTableProps) {
  if (!logs.length) return null

  const columns = Object.keys(logs[0])

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle>Log Sample</CardTitle>
        <CardDescription>
          Showing {logs.length} log entries from the analysis
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={column} className="text-slate-300">
                    {column.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log, index) => (
                <TableRow key={index} className="hover:bg-slate-800/50">
                  {columns.map((column) => {
                    const value = log[column as keyof LogEntry]
                    const displayValue = value instanceof Date 
                      ? value.toLocaleString() 
                      : String(value || '')

                    return (
                      <TableCell key={column} className="text-slate-300">
                        {column === 'level' && (
                          <Badge 
                            variant="outline" 
                            className={getLevelColor(displayValue)}
                          >
                            {displayValue}
                          </Badge>
                        )}
                        {column === 'statusCode' && (
                          <span className={getStatusColor(Number(displayValue))}>
                            {displayValue}
                          </span>
                        )}
                        {column === 'message' && (
                          <span title={displayValue}>
                            {truncateText(displayValue, 100)}
                          </span>
                        )}
                        {column === 'rawLog' && (
                          <span title={displayValue} className="font-mono text-xs">
                            {truncateText(displayValue, 50)}
                          </span>
                        )}
                        {!['level', 'statusCode', 'message', 'rawLog'].includes(column) && (
                          <span>{displayValue}</span>
                        )}
                      </TableCell>
                    )
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
