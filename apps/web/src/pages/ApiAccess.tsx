import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
    Check, Copy, Key, ShieldAlert, Terminal, Activity, ExternalLink, 
    Book, Server, ArrowRightLeft, PiggyBank, Layers, Bot 
} from 'lucide-react'
import { cn } from '@/lib/utils'

export function ApiAccessPage() {
    const [token, setToken] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking')
    const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'accounts' | 'categories' | 'ai'>('overview')

    useEffect(() => {
        const checkApi = async () => {
            try {
                const res = await fetch('http://localhost:3000/doc')
                if (res.ok) setApiStatus('online')
                else setApiStatus('offline')
            } catch (error) {
                setApiStatus('offline')
            }
        }
        checkApi()
    }, [])

    const handleGenerateToken = async () => {
        setIsLoading(true)
        await new Promise(resolve => setTimeout(resolve, 1000))
        const newToken = `sk_live_${Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2)}`
        setToken(newToken)
        setIsLoading(false)
    }

    const copyToClipboard = () => {
        if (token) navigator.clipboard.writeText(token)
    }

    return (
        <div className="container-custom py-6 md:py-8 pb-32">
            {/* Header Section */}
            <div className="space-y-4 mb-8">
                <div className="flex items-center justify-between">
                    <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors border-transparent bg-primary text-primary-foreground hover:bg-primary/80">
                        Developer Hub
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Status da API:</span>
                        {apiStatus === 'checking' && <Badge variant="outline" className="text-muted-foreground">Verificando...</Badge>}
                        {apiStatus === 'online' && <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 gap-1"><Activity className="h-3 w-3" /> Online</Badge>}
                        {apiStatus === 'offline' && <Badge variant="destructive" className="gap-1"><Activity className="h-3 w-3" /> Offline</Badge>}
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">API & Integrações</h1>
                        <p className="text-muted-foreground max-w-2xl mt-2">
                            Acesse seus dados financeiros programaticamente. Utilize nossa API REST para criar automações, 
                            dashboards personalizados ou sincronizar com outros sistemas.
                        </p>
                    </div>
                    <Button variant="outline" className="gap-2 shrink-0" onClick={() => window.open('http://localhost:3000/api-docs', '_blank')}>
                        <ExternalLink className="h-4 w-4" /> Reference Técnica (Swagger)
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left Column: Authentication */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="rounded-xl border bg-card p-6 shadow-sm">
                        <div className="flex items-center gap-2 mb-6">
                            <Key className="h-5 w-5 text-primary" />
                            <h2 className="text-lg font-semibold">Credenciais</h2>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-6">
                            Seu token de acesso é pessoal e intransferível. Ele concede permissão total de leitura e escrita na sua conta.
                        </p>

                        {!token ? (
                            <Button onClick={handleGenerateToken} disabled={isLoading} className="w-full">
                                {isLoading ? 'Gerando chaves...' : 'Gerar Token de Acesso'}
                            </Button>
                        ) : (
                            <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900 p-4 rounded-lg flex items-start gap-3">
                                    <ShieldAlert className="h-5 w-5 text-yellow-600 dark:text-yellow-500 mt-0.5 shrink-0" />
                                    <div>
                                        <h4 className="text-sm font-semibold text-yellow-800 dark:text-yellow-200">Atenção</h4>
                                        <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1 leading-relaxed">
                                            Copie este token agora. Por segurança, ele não será exibido novamente. Se você perdê-lo, precisará gerar um novo.
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-muted-foreground">Bearer Token</label>
                                    <div className="flex gap-2">
                                        <Input value={token} readOnly className="font-mono text-sm bg-muted/50" />
                                        <Button size="icon" variant="outline" onClick={copyToClipboard}>
                                            <Copy className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                                
                                <Button variant="ghost" className="w-full text-xs text-muted-foreground" onClick={() => setToken(null)}>
                                    Fechar e Ocultar
                                </Button>
                            </div>
                        )}
                    </div>

                    <div className="rounded-xl border bg-card p-6 shadow-sm">
                        <h3 className="font-semibold mb-4 text-sm">Resumo de Uso</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between text-sm border-b pb-2">
                                <span className="text-muted-foreground">Limite de Taxa</span>
                                <span className="font-mono">100 req/min</span>
                            </div>
                            <div className="flex justify-between text-sm border-b pb-2">
                                <span className="text-muted-foreground">Formato</span>
                                <span className="font-mono">JSON</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Versão</span>
                                <span className="font-mono">v1</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Documentation Hub */}
                <div className="lg:col-span-8">
                    <div className="rounded-xl border bg-card overflow-hidden shadow-sm">
                        {/* Tabs Navigation */}
                        <div className="flex border-b overflow-x-auto">
                            {[
                                { id: 'overview', label: 'Visão Geral', icon: Book },
                                { id: 'transactions', label: 'Transações', icon: ArrowRightLeft },
                                { id: 'accounts', label: 'Contas & Metas', icon: PiggyBank },
                                { id: 'categories', label: 'Categorias', icon: Layers },
                                { id: 'ai', label: 'Inteligência Artificial', icon: Bot },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={cn(
                                        "flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                                        activeTab === tab.id 
                                            ? "border-primary text-primary bg-primary/5" 
                                            : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                    )}
                                >
                                    <tab.icon className="h-4 w-4" />
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Content Area */}
                        <div className="p-6 md:p-8 min-h-[500px]">
                            
                            {/* OVERVIEW TAB */}
                            {activeTab === 'overview' && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-left-2">
                                    <div className="space-y-4">
                                        <h3 className="text-xl font-semibold flex items-center gap-2">
                                            <Server className="h-5 w-5 text-primary" />
                                            Endpoint Base
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            Todas as requisições devem ser enviadas para a URL base abaixo. 
                                            Utilizamos o protocolo HTTPS para garantir a segurança dos dados.
                                        </p>
                                        <div className="bg-slate-950 text-slate-50 p-4 rounded-lg font-mono text-sm shadow-inner">
                                            https://api.simplemoney.com/v1
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-xl font-semibold">Autenticação</h3>
                                        <p className="text-sm text-muted-foreground">
                                            A API utiliza autenticação via <strong>Bearer Token</strong>. Você deve incluir o token gerado ao lado no cabeçalho <code className="bg-muted px-1 rounded">Authorization</code> de todas as requisições.
                                        </p>
                                        <div className="bg-muted p-4 rounded-lg border">
                                            <p className="text-xs font-mono text-muted-foreground mb-2">Exemplo de Header:</p>
                                            <code className="text-sm font-semibold text-primary">
                                                Authorization: Bearer sk_live_your_token_here
                                            </code>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="p-4 border rounded-lg bg-muted/20">
                                            <h4 className="font-semibold mb-1">Status 200/201</h4>
                                            <p className="text-xs text-muted-foreground">Sucesso. A requisição foi processada corretamente.</p>
                                        </div>
                                        <div className="p-4 border rounded-lg bg-muted/20">
                                            <h4 className="font-semibold mb-1">Status 401</h4>
                                            <p className="text-xs text-muted-foreground">Não autorizado. Verifique seu token.</p>
                                        </div>
                                        <div className="p-4 border rounded-lg bg-muted/20">
                                            <h4 className="font-semibold mb-1">Status 429</h4>
                                            <p className="text-xs text-muted-foreground">Muitas requisições. Aguarde um momento.</p>
                                        </div>
                                        <div className="p-4 border rounded-lg bg-muted/20">
                                            <h4 className="font-semibold mb-1">Status 500</h4>
                                            <p className="text-xs text-muted-foreground">Erro interno. Nossa equipe foi notificada.</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TRANSACTIONS TAB */}
                            {activeTab === 'transactions' && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-left-2">
                                    <div className="space-y-2">
                                        <h3 className="text-xl font-semibold">Transações</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Gerencie suas receitas e despesas. Este é o recurso principal para alimentar seus relatórios.
                                        </p>
                                    </div>

                                    {/* GET */}
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">GET</Badge>
                                            <code className="text-sm font-mono font-semibold">/transactions</code>
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            Lista todas as transações. Suporta filtros via query params.
                                        </p>
                                        <div className="bg-muted rounded-lg p-4 text-sm space-y-2">
                                            <p className="font-medium text-xs uppercase text-muted-foreground">Parâmetros Opcionais</p>
                                            <ul className="list-disc list-inside space-y-1 text-muted-foreground pl-2">
                                                <li><code className="text-foreground">startDate</code> (YYYY-MM-DD): Filtrar início do período</li>
                                                <li><code className="text-foreground">endDate</code> (YYYY-MM-DD): Filtrar fim do período</li>
                                                <li><code className="text-foreground">type</code> (income/expense): Filtrar por tipo</li>
                                            </ul>
                                        </div>
                                    </div>

                                    {/* POST */}
                                    <div className="space-y-3 pt-4 border-t">
                                        <div className="flex items-center gap-3">
                                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">POST</Badge>
                                            <code className="text-sm font-mono font-semibold">/transactions</code>
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            Cria uma nova transação (receita ou despesa).
                                        </p>
                                        <div className="rounded-lg overflow-hidden border">
                                            <div className="bg-muted px-4 py-2 border-b text-xs font-medium text-muted-foreground">Exemplo de Payload (JSON)</div>
                                            <pre className="bg-slate-950 text-slate-50 p-4 text-xs font-mono overflow-x-auto">
{`{
  "description": "Pagamento Freelance",
  "amount": 1500.00,
  "type": "income",
  "date": "2025-01-28T10:00:00Z",
  "categoryId": "uuid-da-categoria",
  "bankAccountId": "uuid-da-conta",
  "isPaid": true
}`}
                                            </pre>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ACCOUNTS & SAVINGS TAB */}
                            {activeTab === 'accounts' && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-left-2">
                                    {/* Accounts */}
                                    <div className="space-y-4">
                                        <h3 className="text-xl font-semibold">Contas Bancárias</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Liste e gerencie as contas onde seu dinheiro está armazenado.
                                        </p>
                                        
                                        <div className="flex items-center gap-3 mt-2">
                                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">GET</Badge>
                                            <code className="text-sm font-mono font-semibold">/accounts</code>
                                        </div>
                                        <div className="flex items-center gap-3 mt-2">
                                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">POST</Badge>
                                            <code className="text-sm font-mono font-semibold">/accounts</code>
                                        </div>
                                        
                                        <div className="bg-muted rounded-lg p-4 mt-2">
                                            <p className="text-xs text-muted-foreground mb-2">Tipos de conta aceitos:</p>
                                            <div className="flex gap-2 flex-wrap">
                                                <Badge variant="secondary">checking</Badge>
                                                <Badge variant="secondary">savings</Badge>
                                                <Badge variant="secondary">investment</Badge>
                                                <Badge variant="secondary">cash</Badge>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-t my-6" />

                                    {/* Savings */}
                                    <div className="space-y-4">
                                        <h3 className="text-xl font-semibold">Metas & Caixinhas</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Gerencie seus objetivos de economia.
                                        </p>
                                        
                                        <div className="flex flex-wrap gap-3 mt-2">
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">GET</Badge>
                                                <code className="text-sm font-mono font-semibold">/savings</code>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">POST</Badge>
                                                <code className="text-sm font-mono font-semibold">/savings</code>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">POST</Badge>
                                                <code className="text-sm font-mono font-semibold">/savings/:id/deposits</code>
                                            </div>
                                        </div>
                                        
                                        <p className="text-xs text-muted-foreground mt-2">
                                            <strong>Dica:</strong> Para movimentar o saldo de uma meta, utilize o endpoint de depósitos. Valores positivos para aporte, negativos para resgate.
                                        </p>

                                        <div className="rounded-lg overflow-hidden border mt-4">
                                            <div className="bg-muted px-4 py-2 border-b text-xs font-medium text-muted-foreground">Exemplo: Aporte em Meta</div>
                                            <pre className="bg-slate-950 text-slate-50 p-4 text-xs font-mono overflow-x-auto">
{`curl -X POST https://api.simplemoney.com/v1/savings/{id}/deposits \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -d '{
    "amount": 500.00,
    "date": "2025-01-28T10:00:00Z",
    "notes": "Economia mensal"
  }'`}
                                            </pre>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* CATEGORIES TAB */}
                            {activeTab === 'categories' && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-left-2">
                                    <div className="space-y-2">
                                        <h3 className="text-xl font-semibold">Categorias</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Organize suas transações. As categorias podem ser de escopo 'pessoal' ou 'negócio'.
                                        </p>
                                    </div>

                                    <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg text-sm text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-900 dark:text-yellow-200">
                                        <strong>Importante:</strong> Ao criar uma transação, o ID da categoria é obrigatório. Use o endpoint GET abaixo para listar os IDs disponíveis.
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-3 border rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">GET</Badge>
                                                <code className="text-sm font-mono font-semibold">/categories</code>
                                            </div>
                                            <span className="text-xs text-muted-foreground">Lista todas as categorias ativas</span>
                                        </div>

                                        <div className="flex items-center justify-between p-3 border rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">POST</Badge>
                                                <code className="text-sm font-mono font-semibold">/categories</code>
                                            </div>
                                            <span className="text-xs text-muted-foreground">Cria nova categoria personalizada</span>
                                        </div>
                                    </div>

                                    <div className="rounded-lg overflow-hidden border mt-4">
                                        <div className="bg-muted px-4 py-2 border-b text-xs font-medium text-muted-foreground">Objeto Categoria (Exemplo)</div>
                                        <pre className="bg-slate-950 text-slate-50 p-4 text-xs font-mono overflow-x-auto">
{`{
  "id": "uuid...",
  "name": "Alimentação",
  "type": "expense",
  "scope": "personal",
  "color": "#F97316",
  "icon": "Utensils"
}`}
                                        </pre>
                                    </div>
                                </div>
                            )}

                            {/* AI TAB */}
                            {activeTab === 'ai' && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-left-2">
                                    <div className="space-y-2">
                                        <h3 className="text-xl font-semibold">Inteligência Artificial (CFO Virtual)</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Utilize nossos modelos de LLM para processar linguagem natural e analisar dados.
                                        </p>
                                    </div>

                                    {/* Smart Entry */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold flex items-center gap-2">
                                            <Zap className="h-4 w-4 text-primary" />
                                            Smart Entry (Processamento de Texto)
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            Converte texto livre em objetos de transação estruturados. Ideal para criar bots de WhatsApp ou Telegram.
                                        </p>
                                        
                                        <div className="flex items-center gap-3 mt-2">
                                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">POST</Badge>
                                            <code className="text-sm font-mono font-semibold">/ai/smart-entry</code>
                                        </div>

                                        <div className="rounded-lg overflow-hidden border mt-4">
                                            <div className="bg-muted px-4 py-2 border-b text-xs font-medium text-muted-foreground">Exemplo: Input &rarr; Output</div>
                                            <pre className="bg-slate-950 text-slate-50 p-4 text-xs font-mono overflow-x-auto">
{`// Request
{ "text": "Almoço no Madero 120 reais" }

// Response
{
  "description": "Almoço no Madero",
  "amount": 120.00,
  "type": "expense",
  "date": "2025-01-28T...",
  "categorySuggestion": "Alimentação"
}`}
                                            </pre>
                                        </div>
                                    </div>

                                    <div className="border-t my-6" />

                                    {/* Chat API */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold flex items-center gap-2">
                                            <Bot className="h-4 w-4 text-primary" />
                                            Chat API
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            Converse com o assistente financeiro. O sistema mantém o contexto da sessão automaticamente.
                                        </p>
                                        
                                        <div className="flex flex-col gap-2 mt-2">
                                            <div className="flex items-center gap-3">
                                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">POST</Badge>
                                                <code className="text-sm font-mono font-semibold">/chat/sessions</code>
                                                <span className="text-xs text-muted-foreground ml-2">Criar Sessão</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">POST</Badge>
                                                <code className="text-sm font-mono font-semibold">/chat/sessions/:id/messages</code>
                                                <span className="text-xs text-muted-foreground ml-2">Enviar Mensagem</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
