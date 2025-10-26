import type { Metadata } from 'next'
import { Inter, Poppins, Outfit } from 'next/font/google'
import './globals.css'
import { ToastProvider } from '@/components/ui/toast'
import { CommandPaletteProvider } from '@/components/ui/command-palette-provider'

const inter = Inter({ subsets: ['latin'] })
const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins'
})
const outfit = Outfit({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-outfit'
})

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
      <body className={`${inter.className} ${poppins.variable} ${outfit.variable}`}>
        <ToastProvider>
          <CommandPaletteProvider customCommands={[]}>
            <div className="min-h-screen relative overflow-hidden bg-slate-950">
          {/* Ultra dark animated background */}
          <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-black">
            {/* Subtle pattern overlay */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(circle at 20% 20%, rgba(30, 41, 59, 0.3) 0%, transparent 50%),
                                radial-gradient(circle at 80% 80%, rgba(30, 41, 59, 0.2) 0%, transparent 50%),
                                radial-gradient(circle at 40% 60%, rgba(15, 23, 42, 0.4) 0%, transparent 50%)`,
                backgroundSize: '100px 100px'
              }}></div>
            </div>
            {/* Animated gradient overlay */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-cyan-600/5 animate-gradient-shift"></div>
            {/* Dark mesh pattern */}
            <div className="absolute inset-0 opacity-20" style={{
              backgroundImage: `linear-gradient(90deg, rgba(15, 23, 42, 0.1) 1px, transparent 1px),
                              linear-gradient(rgba(15, 23, 42, 0.1) 1px, transparent 1px)`,
              backgroundSize: '20px 20px'
            }}></div>
          </div>
          
          {/* Enhanced floating orbs with darker tones */}
          <div className="fixed top-20 left-20 w-80 h-80 bg-blue-600/8 rounded-full blur-3xl animate-float-slow"></div>
          <div className="fixed bottom-20 right-20 w-96 h-96 bg-purple-600/6 rounded-full blur-3xl animate-float-slow" style={{animationDelay: '1.5s'}}></div>
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-cyan-600/7 rounded-full blur-3xl animate-float-slow" style={{animationDelay: '3s'}}></div>
          <div className="fixed top-1/4 right-1/4 w-64 h-64 bg-slate-600/5 rounded-full blur-3xl animate-float" style={{animationDelay: '2.5s'}}></div>
          <div className="fixed bottom-1/4 left-1/3 w-56 h-56 bg-indigo-600/6 rounded-full blur-3xl animate-float" style={{animationDelay: '4s'}}></div>
          
          {/* Content */}
          <div className="relative z-10 min-h-screen flex flex-col">
            <main className="flex-1">
              {children}
            </main>
            
            {/* Footer with Status */}
            <footer className="relative z-10 mt-auto border-t border-slate-800/50">
              <div className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-between">
                  <div className="text-slate-500 text-sm">
                    © 2025 Automated Log Analyzer. All rights reserved.
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-6 py-3 glass-ultra rounded-2xl border border-green-500/20">
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse-glow"></div>
                      <span className="text-sm text-slate-200 font-medium">All systems operational</span>
                    </div>
                    {/* <div className="flex items-center gap-2 px-4 py-2 glass-premium rounded-xl">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                      <span className="text-xs text-slate-400">Dark Mode</span>
                    </div> */}
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </div>
          </CommandPaletteProvider>
        </ToastProvider>
      </body>
    </html>
  )
}
