import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Wallet } from 'lucide-react'
import { useLocation } from 'wouter'

export function RegisterPage() {
  const [, setLocation] = useLocation()

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    // Mock registration -> Go to Plans
    setLocation('/plans')
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center space-y-2 text-center">
          <div className="rounded-full bg-primary/10 p-3">
            <Wallet className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Crie sua conta</h1>
          <p className="text-sm text-muted-foreground">
            Comece a controlar suas finanças hoje
          </p>
        </div>

        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nome Completo</label>
              <Input placeholder="Seu nome" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input type="email" placeholder="seu@email.com" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Senha</label>
              <Input type="password" required minLength={8} />
            </div>
            <Button type="submit" className="w-full">
              Continuar
            </Button>
          </form>
          
          <div className="mt-6 text-center text-sm text-muted-foreground">
            Já tem uma conta?{' '}
            <a 
              href="#" 
              className="font-medium text-primary hover:underline"
              onClick={(e) => { e.preventDefault(); setLocation('/login') }}
            >
              Entrar
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
