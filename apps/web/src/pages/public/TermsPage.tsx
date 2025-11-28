import { ScrollText } from 'lucide-react'

export function TermsPage() {
  return (
    <div className="container-custom py-12 md:py-20">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <div className="mx-auto h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <ScrollText className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Termos de Uso</h1>
          <p className="text-muted-foreground">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
        </div>

        <div className="prose prose-slate dark:prose-invert max-w-none">
          <h3>1. Aceitação dos Termos</h3>
          <p>
            Ao acessar e usar o Simple Money, você aceita e concorda em estar vinculado aos termos e disposições deste acordo.
          </p>

          <h3>2. Descrição do Serviço</h3>
          <p>
            O Simple Money é uma plataforma de gestão financeira multi-tenant que permite aos usuários controlar receitas, despesas, metas e contas bancárias.
          </p>

          <h3>3. Responsabilidades do Usuário</h3>
          <p>
            Você é responsável por manter a confidencialidade de sua conta e senha. O Simple Money não se responsabiliza por perdas decorrentes do uso não autorizado de sua conta.
          </p>

          <h3>4. Uso de Dados</h3>
          <p>
            Seus dados financeiros são privados e criptografados. Não vendemos suas informações para terceiros. Consulte nossa Política de Privacidade para mais detalhes.
          </p>

          <h3>5. Modificações</h3>
          <p>
            Reservamo-nos o direito de modificar estes termos a qualquer momento. As alterações entrarão em vigor imediatamente após a publicação no site.
          </p>
        </div>
      </div>
    </div>
  )
}
