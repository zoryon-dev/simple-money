import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Wallet } from 'lucide-react'
import { useLocation } from 'wouter'

export function LoginPage() {
  const [, setLocation] = useLocation()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Mock login - in reality this would validate credentials
    setLocation('/dashboard')
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center space-y-2 text-center">
          <div className="rounded-full bg-primary/10 p-3">
            <Wallet className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Bem-vindo de volta</h1>
          <p className="text-sm text-muted-foreground">
            Entre com seu e-mail para acessar sua conta
          </p>
        </div>

        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input type="email" placeholder="seu@email.com" required />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Senha</label>
                <a 
                  href="#" 
                  className="text-xs text-primary hover:underline"
                  onClick={(e) => { e.preventDefault(); setLocation('/forgot-password') }}
                >
                  Esqueceu a senha?
                </a>
              </div>
              <Input type="password" required />
            </div>
            <Button type="submit" className="w-full">
              Entrar
            </Button>
          </form>
          
          <div className="mt-6 text-center text-sm text-muted-foreground">
            Não tem uma conta?{' '}
            <a 
              href="#" 
              className="font-medium text-primary hover:underline"
              onClick={(e) => { e.preventDefault(); setLocation('/register') }}
            >
              Criar conta
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
