'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LogEntry } from '@/types'
import { getAnomalyTypeColor, truncateText } from '@/lib/utils'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { AlertTriangle } from 'lucide-react'

interface AnomalyTableProps {
  anomalies: LogEntry[]
}

export function AnomalyTable({ anomalies }: AnomalyTableProps) {
  if (!anomalies.length) return null

  const columns = Object.keys(anomalies[0])

  return (
    <Card className="glass border-red-400/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-400">
          <AlertTriangle className="w-5 h-5" />
          Detected Anomalies
        </CardTitle>
        <CardDescription>
          {anomalies.length} anomalous log entries detected
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
              {anomalies.map((anomaly, index) => (
                <TableRow key={index} className="hover:bg-red-900/20">
                  {columns.map((column) => {
                    const value = anomaly[column as keyof LogEntry]
                    const displayValue = value instanceof Date 
                      ? value.toLocaleString() 
                      : String(value || '')

                    return (
                      <TableCell key={column} className="text-slate-300">
                        {column === 'anomalyType' && (
                          <Badge 
                            variant="outline" 
                            className={getAnomalyTypeColor(displayValue)}
                          >
                            {displayValue.replace(/_/g, ' ')}
                          </Badge>
                        )}
                        {column === 'anomalyScore' && (
                          <span className="font-mono text-red-400">
                            {Number(displayValue).toFixed(3)}
                          </span>
                        )}
                        {column === 'level' && (
                          <Badge 
                            variant="outline" 
                            className="text-red-400 border-red-400/30"
                          >
                            {displayValue}
                          </Badge>
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
                        {!['anomalyType', 'anomalyScore', 'level', 'message', 'rawLog'].includes(column) && (
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
