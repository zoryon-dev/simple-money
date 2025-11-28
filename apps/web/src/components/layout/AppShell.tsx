// Simple Money - App Shell (Layout Principal)
// Layout principal com Header e área de conteúdo

import { ReactNode } from 'react'
import { Header } from './Header'
import { DockMenu } from './DockMenu'
import { Footer } from './Footer'
import { AIChat } from '@/components/ai/AIChat'

interface AppShellProps {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">{children}</main>
      <div className="pb-20 md:pb-24">
        <Footer />
      </div>
      <DockMenu />
      <AIChat />
    </div>
  )
}

