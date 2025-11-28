import { useState, useEffect } from 'react'
import { Lightbulb, TrendingUp, AlertTriangle, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface Insight {
    id: string
    type: 'warning' | 'tip' | 'praise' | 'action'
    title: string
    description: string
    isRead: boolean
}

export function InsightsWidget() {
    const [insights, setInsights] = useState<Insight[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchInsights = async () => {
            try {
                // Mock rápido para UI
                await new Promise(r => setTimeout(r, 1000))
                setInsights([
                    {
                        id: '1',
                        type: 'warning',
                        title: 'Anomalia Detectada',
                        description: 'Sua conta de energia veio 40% acima da média dos últimos 6 meses.',
                        isRead: false
                    },
                    {
                        id: '2',
                        type: 'action',
                        title: 'Sugestão de Economia',
                        description: 'Se você reduzir seus gastos com delivery em 15%, atingirá sua meta de "Viagem" 2 meses antes.',
                        isRead: false
                    }
                ])
            } catch (error) {
                console.error('Failed to fetch insights', error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchInsights()
    }, [])

    if (isLoading) return <div className="h-32 rounded-xl border bg-card animate-pulse" />
    if (insights.length === 0) return null

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {insights.map(insight => (
                <div key={insight.id} className={cn(
                    "rounded-xl border p-4 flex gap-4 transition-all hover:shadow-sm",
                    insight.type === 'warning' ? "bg-red-50 border-red-100 dark:bg-red-900/10 dark:border-red-900" : 
                    insight.type === 'tip' ? "bg-blue-50 border-blue-100 dark:bg-blue-900/10 dark:border-blue-900" : "bg-card"
                )}>
                    <div className={cn(
                        "h-10 w-10 rounded-full flex items-center justify-center shrink-0",
                        insight.type === 'warning' ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"
                    )}>
                        {insight.type === 'warning' ? <AlertTriangle className="h-5 w-5" /> : <Lightbulb className="h-5 w-5" />}
                    </div>
                    <div className="flex-1">
                        <h4 className="font-semibold text-sm mb-1">{insight.title}</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">{insight.description}</p>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 self-center">
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </Button>
                </div>
            ))}
        </div>
    )
}
