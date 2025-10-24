import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Automated Log Analyzer',
  description: 'Intelligent log analysis with AI-powered insights and anomaly detection',
  keywords: ['log analysis', 'anomaly detection', 'AI', 'monitoring', 'debugging'],
  authors: [{ name: 'Log Analyzer Team' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <div className="min-h-screen relative overflow-hidden">
          {/* Premium animated background */}
          <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(circle at 25% 25%, rgba(156, 146, 172, 0.1) 0%, transparent 50%),
                                radial-gradient(circle at 75% 75%, rgba(156, 146, 172, 0.1) 0%, transparent 50%)`,
                backgroundSize: '60px 60px'
              }}></div>
            </div>
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 animate-pulse"></div>
          </div>
          
          {/* Floating orbs */}
          <div className="fixed top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-float"></div>
          <div className="fixed bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float" style={{animationDelay: '1s'}}></div>
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
          
          {/* Content */}
          <div className="relative z-10 min-h-screen flex flex-col">
            <main className="flex-1">
              {children}
            </main>
            
            {/* Footer with Status */}
            <footer className="relative z-10 mt-auto">
              <div className="container mx-auto px-4 py-6">
                <div className="flex items-center justify-between">
                  <div className="text-slate-400 text-sm">
                    © 2024 Automated Log Analyzer. All rights reserved.
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-4 py-2 glass-premium rounded-full">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-sm text-slate-300 font-medium">All systems operational</span>
                    </div>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </div>
      </body>
    </html>
  )
}
