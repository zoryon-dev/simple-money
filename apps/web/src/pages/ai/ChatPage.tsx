import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Plus, MessageSquare, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface Message {
    id: string
    role: 'user' | 'assistant'
    text: string
}

interface ChatSession {
    id: string
    title: string
    date: string
}

export function ChatPage() {
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', role: 'assistant', text: 'Olá! Sou seu CFO Virtual. Posso analisar seus gastos, sugerir cortes ou projetar seu futuro financeiro. O que deseja saber hoje?' }
    ])
    const [input, setInput] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    // Mock History
    const history: ChatSession[] = [
        { id: '1', title: 'Análise de gastos Uber', date: 'Hoje' },
        { id: '2', title: 'Planejamento Viagem 2025', date: 'Ontem' },
        { id: '3', title: 'Dúvida sobre investimentos', date: 'Semana passada' },
    ]

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(scrollToBottom, [messages])

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!input.trim()) return

        const userMsg: Message = { id: crypto.randomUUID(), role: 'user', text: input }
        setMessages(prev => [...prev, userMsg])
        setInput('')
        setIsTyping(true)

        // Mock Response
        await new Promise(r => setTimeout(r, 2000))
        
        const aiMsg: Message = { 
            id: crypto.randomUUID(), 
            role: 'assistant', 
            text: 'Interessante sua pergunta. Analisando seus dados dos últimos 6 meses, percebi que você gasta em média 15% da sua renda com lazer. Isso é saudável, mas se quiser economizar para a viagem, sugiro reduzir para 10%.' 
        }
        setMessages(prev => [...prev, aiMsg])
        setIsTyping(false)
    }

    return (
        <div className="container-custom py-4 h-[calc(100vh-8rem)]">
            <div className="flex h-full border rounded-xl overflow-hidden bg-background shadow-sm">
                
                {/* Sidebar (Desktop) */}
                <div className={cn(
                    "w-64 border-r bg-muted/30 flex-col transition-all duration-300 hidden md:flex",
                    !isSidebarOpen && "w-0 opacity-0 overflow-hidden"
                )}>
                    <div className="p-4">
                        <Button className="w-full justify-start gap-2" variant="outline">
                            <Plus className="h-4 w-4" /> Novo Chat
                        </Button>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto px-2 space-y-1">
                        <p className="px-2 text-xs font-medium text-muted-foreground mb-2 mt-2">Histórico</p>
                        {history.map(session => (
                            <button key={session.id} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:bg-muted rounded-md transition-colors text-left truncate">
                                <MessageSquare className="h-4 w-4 shrink-0" />
                                <span className="truncate">{session.title}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Chat Area */}
                <div className="flex-1 flex flex-col min-w-0 bg-background relative">
                    
                    {/* Chat Header (Mobile Toggle) */}
                    <div className="p-4 border-b flex items-center gap-2 md:hidden">
                        <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                            <Menu className="h-5 w-5" />
                        </Button>
                        <span className="font-semibold">CFO Virtual</span>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 scroll-smooth">
                        {messages.map(msg => (
                            <div key={msg.id} className={cn("flex gap-4 max-w-3xl mx-auto", msg.role === 'user' ? "justify-end" : "justify-start")}>
                                {msg.role === 'assistant' && (
                                    <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center shrink-0 mt-1">
                                        <Bot className="h-5 w-5 text-primary-foreground" />
                                    </div>
                                )}
                                <div className={cn(
                                    "rounded-2xl px-5 py-3 text-sm leading-relaxed shadow-sm",
                                    msg.role === 'user' 
                                        ? "bg-primary text-primary-foreground rounded-tr-sm" 
                                        : "bg-muted/50 border rounded-tl-sm"
                                )}>
                                    {msg.text}
                                </div>
                                {msg.role === 'user' && (
                                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0 mt-1">
                                        <User className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                )}
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex gap-4 max-w-3xl mx-auto justify-start">
                                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center shrink-0 mt-1">
                                    <Bot className="h-5 w-5 text-primary-foreground" />
                                </div>
                                <div className="bg-muted/50 border px-5 py-4 rounded-2xl rounded-tl-sm flex items-center gap-1 h-10">
                                    <span className="h-2 w-2 rounded-full bg-foreground/30 animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <span className="h-2 w-2 rounded-full bg-foreground/30 animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <span className="h-2 w-2 rounded-full bg-foreground/30 animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 border-t bg-background/95 backdrop-blur">
                        <div className="max-w-3xl mx-auto relative">
                            <form onSubmit={handleSend} className="flex gap-2">
                                <Input 
                                    value={input} 
                                    onChange={e => setInput(e.target.value)} 
                                    placeholder="Pergunte sobre suas finanças..." 
                                    className="pr-12 h-12 text-base shadow-sm focus-visible:ring-1"
                                />
                                <Button type="submit" size="icon" className="absolute right-1 top-1 h-10 w-10" disabled={!input.trim() || isTyping}>
                                    <Send className="h-4 w-4" />
                                </Button>
                            </form>
                            <p className="text-xs text-center text-muted-foreground mt-2 hidden md:block">
                                O CFO Virtual pode cometer erros. Verifique informações importantes.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
