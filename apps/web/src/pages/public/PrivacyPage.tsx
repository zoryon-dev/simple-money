import { ShieldCheck } from 'lucide-react'

export function PrivacyPage() {
  return (
    <div className="container-custom py-12 md:py-20">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <div className="mx-auto h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center text-green-600">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Política de Privacidade</h1>
          <p className="text-muted-foreground">Sua segurança é nossa prioridade.</p>
        </div>

        <div className="prose prose-slate dark:prose-invert max-w-none">
          <h3>1. Coleta de Informações</h3>
          <p>
            Coletamos informações que você nos fornece diretamente, como nome, e-mail e dados financeiros inseridos na plataforma.
          </p>

          <h3>2. Uso das Informações</h3>
          <p>
            Utilizamos as informações para operar, manter e melhorar nossos serviços. Seus dados financeiros são usados exclusivamente para gerar seus relatórios e dashboards.
          </p>

          <h3>3. Compartilhamento de Dados</h3>
          <p>
            Não compartilhamos seus dados pessoais com terceiros, exceto quando necessário para fornecer o serviço (ex: processamento de pagamentos) ou exigido por lei.
          </p>

          <h3>4. Segurança</h3>
          <p>
            Empregamos medidas de segurança robustas, incluindo criptografia de dados em trânsito e em repouso, para proteger suas informações contra acesso não autorizado.
          </p>

          <h3>5. Seus Direitos</h3>
          <p>
            Você tem o direito de acessar, corrigir ou excluir seus dados pessoais a qualquer momento através das configurações da sua conta.
          </p>
        </div>
      </div>
    </div>
  )
}
