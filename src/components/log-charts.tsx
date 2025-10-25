'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LogAnalysis } from '@/types'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface LogChartsProps {
  stats: LogAnalysis
}

export function LogCharts({ stats }: LogChartsProps) {
  const { errorAnalysis } = stats

  // Prepare data for charts
  const errorPatterns = errorAnalysis.commonErrorPatterns || []

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Error Patterns */}
      {errorPatterns.length > 0 && (
        <Card className="glass">
          <CardHeader>
            <CardTitle>Common Error Patterns</CardTitle>
            <CardDescription>Most frequent error patterns detected</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={errorPatterns} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis type="number" stroke="#9ca3af" />
                <YAxis dataKey="pattern" type="category" stroke="#9ca3af" width={100} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '6px',
                    color: '#f3f4f6'
                  }} 
                />
                <Bar dataKey="count" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
