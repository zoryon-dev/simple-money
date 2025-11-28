// Simple Money - Header Component
// Header com logo, theme toggle e avatar

import { Moon, Sun, Wallet, User as UserIcon, CreditCard, LogOut, Key, HelpCircle, MessageSquare, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/stores/useAppStore'
import { useEffect, useState } from 'react'
import { useLocation } from 'wouter'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

export function Header() {
  const { user } = useAppStore()
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [, setLocation] = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    // Verificar tema do sistema
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
    const currentTheme = savedTheme || systemTheme
    setTheme(currentTheme)
    document.documentElement.classList.toggle('dark', currentTheme === 'dark')
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.classList.toggle('dark', newTheme === 'dark')
  }

  const handleNavigate = (path: string) => {
    setLocation(path)
    setIsMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container-custom flex h-16 items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setLocation('/dashboard')}>
          <Wallet className="h-6 w-6 text-primary" />
          <h1 className="text-h2 font-primary">Simple Money</h1>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>

          <Popover open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <PopoverTrigger asChild>
              <div 
                className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 cursor-pointer hover:bg-primary/20 transition-colors"
              >
                <span className="text-sm font-medium text-primary">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-2" align="end">
              <div className="flex flex-col gap-1">
                <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground border-b mb-1">
                  {user.name}
                  <p className="text-xs font-normal text-muted-foreground truncate">{user.email}</p>
                </div>
                
                <Button 
                  variant="ghost" 
                  className="justify-start gap-2 h-9 px-2 font-normal"
                  onClick={() => handleNavigate('/profile')}
                >
                  <UserIcon className="h-4 w-4" />
                  Meus Dados
                </Button>
                
                <Button 
                  variant="ghost" 
                  className="justify-start gap-2 h-9 px-2 font-normal"
                  onClick={() => handleNavigate('/billing')}
                >
                  <CreditCard className="h-4 w-4" />
                  Meus Pagamentos
                </Button>

                <div className="my-1 border-t" />
                <p className="px-2 text-xs font-medium text-muted-foreground py-1">Inteligência Artificial</p>

                <Button 
                  variant="ghost" 
                  className="justify-start gap-2 h-9 px-2 font-normal"
                  onClick={() => handleNavigate('/ai-chat')}
                >
                  <MessageSquare className="h-4 w-4 text-primary" />
                  CFO Virtual (Chat)
                </Button>

                <Button 
                  variant="ghost" 
                  className="justify-start gap-2 h-9 px-2 font-normal"
                  onClick={() => handleNavigate('/ai-insights')}
                >
                  <Zap className="h-4 w-4 text-primary" />
                  Central de Inteligência
                </Button>

                <div className="my-1 border-t" />

                <Button 
                  variant="ghost" 
                  className="justify-start gap-2 h-9 px-2 font-normal"
                  onClick={() => handleNavigate('/api-access')}
                >
                  <Key className="h-4 w-4" />
                  API
                </Button>

                <Button 
                  variant="ghost" 
                  className="justify-start gap-2 h-9 px-2 font-normal"
                  onClick={() => handleNavigate('/help')}
                >
                  <HelpCircle className="h-4 w-4" />
                  Central de Ajuda
                </Button>

                <div className="my-1 border-t" />

                <Button 
                  variant="ghost" 
                  className="justify-start gap-2 h-9 px-2 font-normal text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => alert('Logout realizado com sucesso!')}
                >
                  <LogOut className="h-4 w-4" />
                  Sair
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </header>
  )
}

