'use client'

import * as React from "react"
import { CommandPalette, useCommandPalette } from "./command-palette"

interface CommandPaletteProviderProps {
  children: React.ReactNode
  customCommands?: any[]
}

const CommandPaletteContext = React.createContext<{
  isOpen: boolean
  openCommandPalette: () => void
  closeCommandPalette: () => void
  toggleCommandPalette: () => void
  setCustomCommands: (commands: any[]) => void
} | null>(null)

export function CommandPaletteProvider({ children, customCommands = [] }: CommandPaletteProviderProps) {
  const commandPalette = useCommandPalette()
  const [dynamicCommands, setDynamicCommands] = React.useState<any[]>(customCommands)

  const setCustomCommands = React.useCallback((commands: any[]) => {
    setDynamicCommands(commands)
  }, [])

  return (
    <CommandPaletteContext.Provider value={{
      ...commandPalette,
      setCustomCommands
    }}>
      {children}
      <CommandPalette
        isOpen={commandPalette.isOpen}
        onClose={commandPalette.closeCommandPalette}
        onNavigate={(path) => {
          // Handle navigation - you can implement routing logic here
          console.log('Navigate to:', path)
        }}
        onAction={(action) => {
          // Handle actions - you can implement action logic here
          console.log('Execute action:', action)
        }}
        customCommands={dynamicCommands}
      />
    </CommandPaletteContext.Provider>
  )
}

export function useCommandPaletteContext() {
  const context = React.useContext(CommandPaletteContext)
  if (!context) {
    throw new Error('useCommandPaletteContext must be used within CommandPaletteProvider')
  }
  return context
}
