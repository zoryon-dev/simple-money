import { Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function AIInsightCard() {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <h3 className="text-h3">Análise IA</h3>
                </div>
                <Button size="sm" variant="outline">
                    Analisar
                </Button>
            </div>

            <div className="rounded-lg border bg-primary/5 p-4">
                <p className="text-body font-medium text-foreground">
                    "Seus gastos com Alimentação aumentaram 23% este mês. Considere revisar refeições fora de casa."
                </p>
            </div>
        </div>
    )
}
