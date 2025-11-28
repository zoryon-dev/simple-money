import { useState, useRef, useEffect } from 'react'
import { MessageSquare, X, Send, Bot, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface Message {
    id: string
    role: 'user' | 'assistant'
    text: string
}

export function AIChat() {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', role: 'assistant', text: 'Olá! Sou seu assistente financeiro. Como posso ajudar hoje?' }
    ])
    const [input, setInput] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

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

        try {
            // Mock API Call
            // const res = await fetch('http://localhost:3000/v1/ai/chat', ...)
            
            await new Promise(r => setTimeout(r, 1500))
            
            const aiMsg: Message = { 
                id: crypto.randomUUID(), 
                role: 'assistant', 
                text: 'Entendi. Analisando seus gastos de transporte, você teve um aumento de 15% este mês. Gostaria de ver o detalhe?' 
            }
            setMessages(prev => [...prev, aiMsg])
        } catch (error) {
            console.error(error)
        } finally {
            setIsTyping(false)
        }
    }

    return (
        <>
            {/* Toggle Button */}
            <Button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "fixed bottom-24 right-4 z-50 h-14 w-14 rounded-full shadow-lg transition-all md:bottom-8 md:right-8",
                    isOpen ? "rotate-90 bg-destructive text-destructive-foreground hover:bg-destructive/90" : "bg-primary text-primary-foreground"
                )}
            >
                {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
            </Button>

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-40 right-4 z-40 w-[90vw] max-w-[380px] rounded-2xl border bg-card shadow-2xl md:bottom-24 md:right-8 animate-in slide-in-from-bottom-5 fade-in zoom-in-95">
                    
                    {/* Header */}
                    <div className="flex items-center gap-3 border-b p-4 bg-primary/5 rounded-t-2xl">
                        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                            <Bot className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-sm">CFO Virtual</h3>
                            <p className="text-xs text-muted-foreground">Online</p>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="h-[350px] overflow-y-auto p-4 space-y-4">
                        {messages.map(msg => (
                            <div key={msg.id} className={cn("flex gap-2", msg.role === 'user' ? "justify-end" : "justify-start")}>
                                {msg.role === 'assistant' && (
                                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                                        <Bot className="h-3 w-3 text-primary" />
                                    </div>
                                )}
                                <div className={cn(
                                    "rounded-2xl px-4 py-2 text-sm max-w-[80%]",
                                    msg.role === 'user' 
                                        ? "bg-primary text-primary-foreground rounded-tr-none" 
                                        : "bg-muted text-foreground rounded-tl-none"
                                )}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex gap-2 justify-start">
                                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                                    <Bot className="h-3 w-3 text-primary" />
                                </div>
                                <div className="bg-muted px-4 py-2 rounded-2xl rounded-tl-none">
                                    <div className="flex gap-1">
                                        <span className="h-2 w-2 rounded-full bg-foreground/30 animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <span className="h-2 w-2 rounded-full bg-foreground/30 animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <span className="h-2 w-2 rounded-full bg-foreground/30 animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSend} className="p-4 border-t flex gap-2">
                        <Input 
                            value={input} 
                            onChange={e => setInput(e.target.value)} 
                            placeholder="Digite sua pergunta..." 
                            className="flex-1"
                        />
                        <Button type="submit" size="icon" disabled={!input.trim() || isTyping}>
                            <Send className="h-4 w-4" />
                        </Button>
                    </form>
                </div>
            )}
        </>
    )
}
