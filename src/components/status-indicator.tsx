'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'

export function StatusIndicator() {
  const [status, setStatus] = useState<'ok' | 'error' | 'loading'>('loading')
  const [lastCheck, setLastCheck] = useState<Date | null>(null)

  const checkHealth = async () => {
    try {
      setStatus('loading')
      const response = await fetch('/api/health')
      const data = await response.json()
      
      setStatus(data.status === 'ok' ? 'ok' : 'error')
      setLastCheck(new Date())
    } catch (error) {
      setStatus('error')
      setLastCheck(new Date())
    }
  }

  useEffect(() => {
    checkHealth()
    const interval = setInterval(checkHealth, 30000) // Check every 30 seconds
    return () => clearInterval(interval)
  }, [])

  return (
    <Card className="glass-premium fixed bottom-6 right-6 w-80 hover-lift animate-fade-in-up">
      <CardContent className="p-5">
        <div className="flex items-center gap-4">
          <div className="relative">
            {status === 'loading' && (
              <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                <Loader2 className="w-5 h-5 animate-spin text-blue-400" />
              </div>
            )}
            {status === 'ok' && (
              <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
            )}
            {status === 'error' && (
              <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center">
                <XCircle className="w-5 h-5 text-red-400" />
              </div>
            )}
            <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${
              status === 'ok' ? 'bg-green-400 animate-pulse' : 
              status === 'error' ? 'bg-red-400 animate-pulse' : 
              'bg-blue-400 animate-pulse'
            }`}></div>
          </div>
          
          <div className="flex-1">
            <p className="text-sm font-semibold text-white">
              {status === 'ok' && 'All systems operational'}
              {status === 'error' && 'Service unavailable'}
              {status === 'loading' && 'Checking status...'}
            </p>
            {lastCheck && (
              <p className="text-xs text-slate-400 mt-1">
                Last checked: {lastCheck.toLocaleTimeString()}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
