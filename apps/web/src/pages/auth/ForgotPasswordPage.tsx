import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Mail } from 'lucide-react'
import { useLocation } from 'wouter'
import { useState } from 'react'

export function ForgotPasswordPage() {
  const [, setLocation] = useLocation()
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-sm space-y-6">
        <Button 
            variant="ghost" 
            className="gap-2 pl-0 hover:bg-transparent hover:text-primary"
            onClick={() => setLocation('/login')}
        >
            <ArrowLeft className="h-4 w-4" /> Voltar para o login
        </Button>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Recuperar Senha</h1>
          <p className="text-sm text-muted-foreground">
            {submitted 
                ? "Verifique seu e-mail para instruções de redefinição."
                : "Digite seu e-mail e enviaremos um link para redefinir sua senha."}
          </p>
        </div>

        {!submitted ? (
            <div className="rounded-xl border bg-card p-6 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input type="email" placeholder="seu@email.com" required />
                </div>
                <Button type="submit" className="w-full">
                Enviar Link
                </Button>
            </form>
            </div>
        ) : (
            <div className="rounded-xl border bg-card p-8 shadow-sm flex flex-col items-center text-center space-y-4">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <Mail className="h-6 w-6" />
                </div>
                <h3 className="font-semibold">Email Enviado!</h3>
                <p className="text-sm text-muted-foreground">
                    Se existir uma conta associada a este e-mail, você receberá o link em instantes.
                </p>
                <Button variant="outline" className="w-full" onClick={() => setLocation('/login')}>
                    Voltar ao Login
                </Button>
            </div>
        )}
      </div>
    </div>
  )
}
