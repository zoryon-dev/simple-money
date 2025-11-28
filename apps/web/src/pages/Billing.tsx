import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, Download, CreditCard, Clock } from 'lucide-react'

export function BillingPage() {
    const invoices = [
        { id: 'INV-001', date: '28/01/2025', amount: 29.90, status: 'paid' },
        { id: 'INV-002', date: '28/12/2024', amount: 29.90, status: 'paid' },
        { id: 'INV-003', date: '28/11/2024', amount: 29.90, status: 'paid' },
    ]

    return (
        <div className="container-custom py-6 md:py-8 pb-32">
            <h1 className="text-h1 mb-6">Meus Pagamentos</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Plano Atual */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="rounded-xl border bg-card p-6">
                        <h2 className="text-lg font-semibold mb-4">Plano Atual</h2>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-2xl font-bold">Pro</span>
                            <Badge className="bg-primary text-primary-foreground">Ativo</Badge>
                        </div>
                        <p className="text-muted-foreground mb-6">R$ 29,90 / mês</p>
                        
                        <div className="space-y-3 mb-6">
                            <div className="flex items-center gap-2 text-sm">
                                <Check className="h-4 w-4 text-primary" />
                                <span>Contas ilimitadas</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <Check className="h-4 w-4 text-primary" />
                                <span>Relatórios avançados</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <Check className="h-4 w-4 text-primary" />
                                <span>Integração WhatsApp</span>
                            </div>
                        </div>

                        <Button className="w-full" variant="outline">Gerenciar Assinatura</Button>
                    </div>

                    <div className="rounded-xl border bg-card p-6">
                        <h2 className="text-lg font-semibold mb-4">Método de Pagamento</h2>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                                <CreditCard className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="font-medium">Mastercard final 8832</p>
                                <p className="text-xs text-muted-foreground">Expira em 12/28</p>
                            </div>
                        </div>
                        <Button variant="ghost" size="sm" className="w-full">Alterar Cartão</Button>
                    </div>
                </div>

                {/* Histórico de Faturas */}
                <div className="lg:col-span-2">
                    <div className="rounded-xl border bg-card p-6">
                        <h2 className="text-lg font-semibold mb-6">Histórico de Faturas</h2>
                        
                        <div className="space-y-4">
                            {invoices.map((invoice) => (
                                <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-full bg-green-100 text-green-700 flex items-center justify-center">
                                            <Check className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="font-medium">Fatura #{invoice.id}</p>
                                            <p className="text-sm text-muted-foreground">{invoice.date}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <span className="font-medium">R$ {invoice.amount.toFixed(2).replace('.', ',')}</span>
                                        <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">Pago</Badge>
                                        <Button size="icon" variant="ghost">
                                            <Download className="h-4 w-4 text-muted-foreground" />
                                        </Button>
                                    </div>
                                </div>
                            ))}

                            <div className="flex items-center justify-between p-4 border rounded-lg opacity-60">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-full bg-muted text-muted-foreground flex items-center justify-center">
                                        <Clock className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Próxima Fatura</p>
                                        <p className="text-sm text-muted-foreground">28/02/2025</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <span className="font-medium">R$ 29,90</span>
                                    <Badge variant="outline">Agendado</Badge>
                                    <div className="w-9"></div> {/* Spacer for alignment */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
