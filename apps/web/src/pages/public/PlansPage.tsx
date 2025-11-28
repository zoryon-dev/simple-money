import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'
import { useLocation } from 'wouter'

export function PlansPage() {
  const [, setLocation] = useLocation()

  const handleSelectPlan = (plan: string) => {
    console.log('Selected plan:', plan)
    // Here logic to process payment or set plan
    setLocation('/dashboard')
  }

  return (
    <div className="min-h-screen py-20 px-4 bg-muted/30">
      <div className="container-custom max-w-5xl space-y-12 text-center">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Escolha o plano ideal</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comece grátis e evolua conforme suas necessidades financeiras crescem.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          
          {/* Free Plan */}
          <div className="rounded-2xl border bg-card p-8 flex flex-col hover:shadow-lg transition-all">
            <h3 className="font-semibold text-lg">Starter</h3>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-4xl font-bold">R$ 0</span>
              <span className="text-muted-foreground">/mês</span>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">Para quem está começando a se organizar.</p>
            
            <ul className="mt-8 space-y-3 flex-1">
              {['1 Conta Bancária', 'Categorias Básicas', 'Dashboard Resumido', 'Histórico de 30 dias'].map(feature => (
                <li key={feature} className="flex items-center gap-3 text-sm">
                  <Check className="h-4 w-4 text-primary" />
                  {feature}
                </li>
              ))}
            </ul>
            
            <Button variant="outline" className="mt-8 w-full" onClick={() => handleSelectPlan('free')}>
              Começar Grátis
            </Button>
          </div>

          {/* Pro Plan */}
          <div className="rounded-2xl border-2 border-primary bg-card p-8 flex flex-col relative shadow-xl transform md:-translate-y-4">
            <div className="absolute top-0 right-0 -mt-3 -mr-3">
                <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">Popular</span>
            </div>
            <h3 className="font-semibold text-lg text-primary">Pro</h3>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-4xl font-bold">R$ 29,90</span>
              <span className="text-muted-foreground">/mês</span>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">Tudo o que você precisa para controle total.</p>
            
            <ul className="mt-8 space-y-3 flex-1">
              {['Contas Ilimitadas', 'Categorias Personalizadas', 'Previsão Financeira (IA)', 'API Access', 'Suporte Prioritário'].map(feature => (
                <li key={feature} className="flex items-center gap-3 text-sm">
                  <Check className="h-4 w-4 text-primary" />
                  {feature}
                </li>
              ))}
            </ul>
            
            <Button className="mt-8 w-full" onClick={() => handleSelectPlan('pro')}>
              Selecionar Pro
            </Button>
          </div>

          {/* Business Plan */}
          <div className="rounded-2xl border bg-card p-8 flex flex-col hover:shadow-lg transition-all">
            <h3 className="font-semibold text-lg">Business</h3>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-4xl font-bold">R$ 89,90</span>
              <span className="text-muted-foreground">/mês</span>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">Para pequenos negócios e freelancers.</p>
            
            <ul className="mt-8 space-y-3 flex-1">
              {['Múltiplos Usuários', 'Gestão de Clientes', 'Faturamento', 'Relatórios Fiscais', 'API Dedicada'].map(feature => (
                <li key={feature} className="flex items-center gap-3 text-sm">
                  <Check className="h-4 w-4 text-primary" />
                  {feature}
                </li>
              ))}
            </ul>
            
            <Button variant="outline" className="mt-8 w-full" onClick={() => handleSelectPlan('business')}>
              Contatar Vendas
            </Button>
          </div>

        </div>
      </div>
    </div>
  )
}
