import { TrendingUp, TrendingDown, ArrowRight, Target, AlertTriangle, Lightbulb, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export function InsightsPage() {
    return (
        <div className="container-custom py-6 md:py-8 pb-32">
            <div className="flex items-center gap-3 mb-8">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <Zap className="h-6 w-6" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold">Central de Inteligência</h1>
                    <p className="text-sm text-muted-foreground">Análises profundas e recomendações personalizadas.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Coluna da Esquerda: Análise de Tendências (Diagnóstico) */}
                <div className="space-y-6">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-muted-foreground" />
                        Diagnóstico Financeiro
                    </h2>

                    {/* Card 1: Anomalia */}
                    <div className="rounded-xl border bg-card p-6">
                        <div className="flex items-start gap-4">
                            <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 shrink-0">
                                <AlertTriangle className="h-5 w-5" />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-semibold">Anomalia em Moradia</h3>
                                    <Badge variant="destructive">Alerta</Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Sua conta de energia elétrica veio <strong>40% acima da média</strong> histórica. Isso representa R$ 120,00 a mais que o esperado.
                                </p>
                                <div className="h-2 w-full bg-muted rounded-full mt-2 overflow-hidden">
                                    <div className="h-full bg-red-500 w-[85%]"></div>
                                </div>
                                <p className="text-xs text-muted-foreground text-right">85% do orçamento da categoria consumido</p>
                            </div>
                        </div>
                    </div>

                    {/* Card 2: Tendência Positiva */}
                    <div className="rounded-xl border bg-card p-6">
                        <div className="flex items-start gap-4">
                            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 shrink-0">
                                <TrendingDown className="h-5 w-5" />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-semibold">Redução em Transportes</h3>
                                    <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">Positivo</Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Parabéns! Seus gastos com Uber caíram <strong>15%</strong> este mês comparado à média. Você economizou R$ 85,00.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Card 3: Padrão Recorrente */}
                    <div className="rounded-xl border bg-card p-6">
                        <div className="flex items-start gap-4">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                                <Lightbulb className="h-5 w-5" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="font-semibold">Padrão de Fim de Semana</h3>
                                <p className="text-sm text-muted-foreground">
                                    Notei que 60% dos seus gastos discricionários ocorrem entre sexta e domingo. Planejar o fim de semana pode ter alto impacto.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Coluna da Direita: Plano de Ação (Prognóstico) */}
                <div className="space-y-6">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <Target className="h-5 w-5 text-muted-foreground" />
                        Plano de Ação Sugerido
                    </h2>

                    {/* Action 1 */}
                    <div className="rounded-xl border bg-gradient-to-br from-card to-primary/5 p-6 border-l-4 border-l-primary">
                        <h3 className="font-semibold mb-2">1. Ajustar Meta de Reserva</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Com a economia em transportes, você pode aumentar o aporte mensal na "Reserva de Emergência" em R$ 85,00 sem sentir no bolso.
                        </p>
                        <Button size="sm" className="gap-2">
                            Aplicar Sugestão <ArrowRight className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* Action 2 */}
                    <div className="rounded-xl border bg-card p-6 border-l-4 border-l-orange-400">
                        <h3 className="font-semibold mb-2">2. Revisar Assinaturas</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Você tem 3 assinaturas de streaming (Netflix, Prime, Disney+) totalizando R$ 110,00. O uso do Disney+ foi baixo no último mês.
                        </p>
                        <Button size="sm" variant="outline" className="gap-2">
                            Ver Assinaturas
                        </Button>
                    </div>

                    {/* Action 3 */}
                    <div className="rounded-xl border bg-card p-6 border-l-4 border-l-green-500">
                        <h3 className="font-semibold mb-2">3. Antecipar Fatura</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Você tem saldo em caixa hoje para antecipar a fatura do cartão Nubank e ganhar R$ 12,00 de desconto (estimado).
                        </p>
                        <Button size="sm" variant="outline" className="gap-2">
                            Simular Antecipação
                        </Button>
                    </div>
                </div>

            </div>
        </div>
    )
}
