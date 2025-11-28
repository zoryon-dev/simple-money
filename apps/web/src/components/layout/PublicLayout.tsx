import { ReactNode } from 'react'
import { Wallet } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLocation } from 'wouter'
import { Footer } from './Footer'

interface PublicLayoutProps {
  children: ReactNode
}

export function PublicLayout({ children }: PublicLayoutProps) {
  const [, setLocation] = useLocation()

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Public Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container-custom flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setLocation('/')}>
            <Wallet className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold font-primary tracking-tight">Simple Money</span>
          </div>

          <nav className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => setLocation('/login')}>
              Entrar
            </Button>
            <Button onClick={() => setLocation('/register')}>
              Começar Agora
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <Footer />
    </div>
  )
}
