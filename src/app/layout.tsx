import type { Metadata } from 'next'
import { Inter, Outfit } from 'next/font/google'
import './globals.css'
import { ToastProvider } from '@/components/ui/toast'
import { CommandPaletteProvider } from '@/components/ui/command-palette-provider'

const inter = Inter({ subsets: ['latin'] })
const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-outfit'
})

export const metadata: Metadata = {
  title: 'LOG ANALYZER // AUTOMATED INTELLIGENCE SYSTEM',
  description: 'Intelligent log analysis with AI-powered insights and anomaly detection',
  keywords: ['log analysis', 'anomaly detection', 'AI', 'monitoring', 'debugging'],
  authors: [{ name: 'Log Analyzer Team' }],
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} ${outfit.variable}`}>
        <ToastProvider>
          <CommandPaletteProvider customCommands={[]}>

            {/* ── Bauhaus geometric background ── */}
            <div className="fixed inset-0 bauhaus-bg z-0 pointer-events-none">

              {/* Grid already applied by .bauhaus-bg */}

              {/* Yellow triangle — top-left Bauhaus accent */}
              <div
                className="absolute top-0 left-0 w-28 h-28 opacity-80"
                style={{
                  background: '#F5E642',
                  clipPath: 'polygon(0 0, 100% 0, 0 100%)',
                }}
              />

              {/* Red triangle — bottom-right */}
              <div
                className="absolute bottom-0 right-0 w-20 h-20 opacity-60"
                style={{
                  background: '#FF3131',
                  clipPath: 'polygon(100% 0, 100% 100%, 0 100%)',
                }}
              />

              {/* Bauhaus spinning circle — top right decorative */}
              <div
                className="absolute top-8 right-32 w-48 h-48 animate-bauhaus-spin opacity-[0.04]"
                style={{
                  border: '1px solid #F5E642',
                  borderRadius: '50%',
                }}
              />
              <div
                className="absolute top-16 right-40 w-32 h-32 animate-bauhaus-spin opacity-[0.04]"
                style={{
                  border: '1px solid #39FF14',
                  borderRadius: '50%',
                  animationDirection: 'reverse',
                  animationDuration: '14s',
                }}
              />

              {/* Blue square — geometric mid-left accent */}
              <div
                className="absolute top-1/3 left-0 w-1 h-32 opacity-30"
                style={{ background: 'linear-gradient(180deg, transparent, #0057FF, transparent)' }}
              />

              {/* Green vertical line — right side */}
              <div
                className="absolute bottom-1/3 right-0 w-1 h-24 opacity-20"
                style={{ background: 'linear-gradient(180deg, transparent, #39FF14, transparent)' }}
              />

              {/* Horizontal accent line */}
              <div
                className="absolute top-0 left-28 right-0 h-px opacity-20"
                style={{ background: 'linear-gradient(90deg, rgba(245,230,66,0.5), transparent 40%)' }}
              />
            </div>

            {/* ── Content layer ── */}
            <div className="relative z-10 min-h-screen flex flex-col">
              <main className="flex-1">{children}</main>

              {/* ── Terminal status footer ── */}
              <footer className="relative z-10 border-t border-[#2C2C2C] bg-[#0E0E0E]">
                {/* Top accent bar */}
                <div className="h-px w-full" style={{ background: 'linear-gradient(90deg, #F5E642 0%, transparent 40%)' }} />

                <div className="px-6 py-4 flex items-center justify-between">
                  <div className="font-mono text-[10px] text-[#3A3A3A] tracking-widest uppercase">
                    © 2025 Automated Log Analyzer
                  </div>

                  <div className="flex items-center gap-6">
                    {/* System status */}
                    <div className="flex items-center gap-2 font-mono text-[10px] tracking-widest uppercase">
                      <div
                        className="w-1.5 h-1.5 rounded-full bg-[#39FF14] animate-pulse-green"
                        style={{ boxShadow: '0 0 6px #39FF14' }}
                      />
                      <span className="text-[#39FF14]">SYS OPERATIONAL</span>
                    </div>

                    {/* Build info */}
                    <div className="font-mono text-[10px] text-[#3A3A3A] tracking-widest">
                      v1.0.0 // BAUHAUS BUILD
                    </div>
                  </div>
                </div>

                {/* Built by */}
                <div className="px-6 pb-4 text-center">
                  <p className="font-mono text-[10px] text-[#3A3A3A] tracking-widest">
                    CRAFTED BY{' '}
                    <a
                      href="https://www.linkedin.com/in/aakash-sharma-dev/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#F5E642] hover:text-[#FF8C00] transition-colors duration-200"
                    >
                      AAKASH SHARMA
                    </a>
                  </p>
                </div>
              </footer>
            </div>

          </CommandPaletteProvider>
        </ToastProvider>
      </body>
    </html>
  )
}
