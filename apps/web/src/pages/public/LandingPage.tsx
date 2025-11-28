import { Button } from '@/components/ui/button'
import { ArrowRight, BarChart3, Lock, Zap } from 'lucide-react'
import { useLocation } from 'wouter'

export function LandingPage() {
  const [, setLocation] = useLocation()

  return (
    <div className="flex flex-col gap-20 py-20">
      
      {/* Hero Section */}
      <section className="container-custom text-center space-y-6">
        <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium text-primary bg-primary/10 mb-4">
          <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
          Novidade: Integração via API disponível
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight max-w-4xl mx-auto">
          Gerencie suas finanças sem <span className="text-primary">complexidade</span>.
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          O controle financeiro que você sempre quis, com a simplicidade que você precisa. 
          Multi-tenant, seguro e pronto para o seu negócio.
        </p>
        <div className="flex justify-center gap-4 pt-4">
          <Button size="lg" className="gap-2 h-12 px-8 text-base" onClick={() => setLocation('/register')}>
            Criar Conta Grátis <ArrowRight className="h-4 w-4" />
          </Button>
          <Button size="lg" variant="outline" className="h-12 px-8 text-base" onClick={() => setLocation('/login')}>
            Já tenho conta
          </Button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl border bg-card hover:shadow-lg transition-all">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
              <Zap className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Zero Fricção</h3>
            <p className="text-muted-foreground">
              Registre transações em segundos. Interface pensada para ser rápida e intuitiva, mobile-first.
            </p>
          </div>
          <div className="p-6 rounded-2xl border bg-card hover:shadow-lg transition-all">
            <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 mb-4">
              <BarChart3 className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Análises Poderosas</h3>
            <p className="text-muted-foreground">
              Dashboards automáticos, previsões baseadas em IA e relatórios detalhados para tomada de decisão.
            </p>
          </div>
          <div className="p-6 rounded-2xl border bg-card hover:shadow-lg transition-all">
            <div className="h-12 w-12 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500 mb-4">
              <Lock className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Segurança Total</h3>
            <p className="text-muted-foreground">
              Arquitetura Multi-tenant com isolamento de dados e autenticação moderna. Seus dados são seus.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="container-custom">
        <div className="rounded-3xl bg-primary text-primary-foreground p-12 text-center space-y-6">
          <h2 className="text-3xl font-bold">Pronto para assumir o controle?</h2>
          <p className="text-primary-foreground/80 max-w-xl mx-auto text-lg">
            Junte-se a milhares de usuários que simplificaram sua vida financeira.
          </p>
          <Button size="lg" variant="secondary" className="mt-4" onClick={() => setLocation('/register')}>
            Começar Gratuitamente
          </Button>
        </div>
      </section>

    </div>
  )
}
