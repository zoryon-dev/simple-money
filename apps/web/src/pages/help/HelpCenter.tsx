import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Mail, Search, MessageCircle } from 'lucide-react'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion" // Check if this exists or I need to mock/create simple one
import { Modal } from '@/components/ui/modal'

const faqs = [
    {
        question: "Como conectar minha conta bancária?",
        answer: "Atualmente, a inserção é manual para garantir total privacidade. Estamos trabalhando em integrações via Open Finance para o futuro."
    },
    {
        question: "Posso acessar via celular?",
        answer: "Sim! O Simple Money é totalmente responsivo e funciona como um app no seu navegador mobile."
    },
    {
        question: "Como funciona a previsão financeira?",
        answer: "Utilizamos uma análise de regressão linear baseada no seu histórico de 6 meses para projetar suas finanças futuras."
    },
    {
        question: "Meus dados estão seguros?",
        answer: "Absolutamente. Utilizamos criptografia de ponta a ponta e seus dados são isolados em nossa arquitetura multi-tenant."
    }
]

export function HelpCenterPage() {
    const [isContactOpen, setIsContactOpen] = useState(false)
    const [search, setSearch] = useState('')

    const filteredFaqs = faqs.filter(f => 
        f.question.toLowerCase().includes(search.toLowerCase()) || 
        f.answer.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="container-custom py-6 md:py-8 pb-32">
            <div className="max-w-3xl mx-auto space-y-8">
                
                {/* Header */}
                <div className="text-center space-y-4">
                    <h1 className="text-h1">Central de Ajuda</h1>
                    <p className="text-muted-foreground">Como podemos ajudar você hoje?</p>
                    <div className="relative max-w-lg mx-auto">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                            placeholder="Buscar dúvidas..." 
                            className="pl-9" 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {/* FAQ */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Perguntas Frequentes</h2>
                    {/* Simplified Accordion for now if UI component missing, using simple details/summary logic or simple divs */}
                    <div className="space-y-2">
                        {filteredFaqs.map((faq, index) => (
                            <div key={index} className="border rounded-lg p-4 bg-card">
                                <h3 className="font-medium mb-2">{faq.question}</h3>
                                <p className="text-sm text-muted-foreground">{faq.answer}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Contact CTA */}
                <div className="rounded-xl bg-primary/5 border border-primary/20 p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <MessageCircle className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="font-semibold">Ainda precisa de ajuda?</h3>
                            <p className="text-sm text-muted-foreground">Nossa equipe responde em até 24 horas.</p>
                        </div>
                    </div>
                    <Button onClick={() => setIsContactOpen(true)}>
                        <Mail className="mr-2 h-4 w-4" />
                        Entrar em Contato
                    </Button>
                </div>
            </div>

            {/* Contact Modal */}
            <Modal
                isOpen={isContactOpen}
                onClose={() => setIsContactOpen(false)}
                title="Enviar Mensagem"
            >
                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setIsContactOpen(false); }}>
                    <div>
                        <label className="text-sm font-medium">Assunto</label>
                        <Input placeholder="Sobre o que você quer falar?" required className="mt-1" />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Mensagem</label>
                        <textarea 
                            className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1"
                            placeholder="Descreva seu problema ou sugestão..."
                            required
                        />
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <Button type="button" variant="outline" onClick={() => setIsContactOpen(false)}>Cancelar</Button>
                        <Button type="submit">Enviar Email</Button>
                    </div>
                </form>
            </Modal>
        </div>
    )
}
