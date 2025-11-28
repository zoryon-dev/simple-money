import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MessageSquare, Mail, MapPin } from 'lucide-react'

export function SupportPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert('Mensagem enviada! Nossa equipe entrará em contato em breve.')
  }

  return (
    <div className="container-custom py-12 md:py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* Contact Info */}
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-4">Como podemos ajudar?</h1>
            <p className="text-lg text-muted-foreground">
              Tem alguma dúvida sobre o Simple Money? Estamos aqui para ajudar você a ter o melhor controle financeiro possível.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold">Email</h3>
                <p className="text-sm text-muted-foreground">suporte@simplemoney.com</p>
                <p className="text-sm text-muted-foreground">Resposta em até 24h</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold">Escritório</h3>
                <p className="text-sm text-muted-foreground">Av. Paulista, 1000 - São Paulo, SP</p>
                <p className="text-sm text-muted-foreground">Brasil</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="rounded-2xl border bg-card p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <MessageSquare className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Envie uma mensagem</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nome</label>
                <Input placeholder="Seu nome" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Sobrenome</label>
                <Input placeholder="Seu sobrenome" required />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input type="email" placeholder="seu@email.com" required />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Assunto</label>
              <Input placeholder="Como podemos ajudar?" required />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Mensagem</label>
              <textarea 
                className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Descreva sua dúvida..."
                required
              />
            </div>

            <Button type="submit" className="w-full">Enviar Mensagem</Button>
          </form>
        </div>

      </div>
    </div>
  )
}
