import { useState } from 'react'
import { useAppStore } from '@/stores/useAppStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { User, Mail, Lock, Smartphone, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ProfilePage() {
    const { user, setUser } = useAppStore()
    
    // Local state for form fields to avoid store updates on every keystroke
    const [name, setName] = useState(user.name)
    const [email, setEmail] = useState(user.email)

    const handleSaveProfile = (e: React.FormEvent) => {
        e.preventDefault()
        setUser({ ...user, name, email })
        // Show success toast (implement later)
    }

    return (
        <div className="container-custom py-6 md:py-8 pb-32">
            <h1 className="text-h1 mb-6">Meu Perfil</h1>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                
                {/* Coluna Esquerda: Cartão de Identidade */}
                <div className="lg:col-span-1">
                    <div className="rounded-xl border bg-card p-6 flex flex-col items-center text-center">
                        <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary text-3xl font-bold">
                            {user.avatar ? (
                                <img src={user.avatar} alt={user.name} className="h-full w-full rounded-full object-cover" />
                            ) : (
                                <span>{user.name.charAt(0).toUpperCase()}</span>
                            )}
                        </div>
                        <h2 className="text-xl font-bold">{user.name}</h2>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        <p className="text-xs text-muted-foreground mt-1">Membro desde {new Date(user.createdAt).getFullYear()}</p>
                        
                        <div className="mt-6 w-full">
                             <Button variant="outline" className="w-full gap-2 text-destructive hover:text-destructive">
                                <LogOut className="h-4 w-4" />
                                Sair da Conta
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Coluna Direita: Formulários e Configurações */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    
                    {/* Dados Pessoais */}
                    <div className="rounded-xl border bg-card p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <User className="h-5 w-5 text-primary" />
                            <h3 className="text-lg font-semibold">Dados Pessoais</h3>
                        </div>
                        
                        <form onSubmit={handleSaveProfile} className="flex flex-col gap-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Nome Completo</label>
                                    <Input 
                                        value={name} 
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Seu nome"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Email</label>
                                    <Input 
                                        value={email} 
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="seu@email.com"
                                        type="email"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end mt-2">
                                <Button type="submit">Salvar Alterações</Button>
                            </div>
                        </form>
                    </div>

                    {/* Segurança (Placeholder) */}
                    <div className="rounded-xl border bg-card p-6 opacity-75">
                        <div className="flex items-center gap-2 mb-6">
                            <Lock className="h-5 w-5 text-primary" />
                            <h3 className="text-lg font-semibold">Segurança</h3>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Nova Senha</label>
                                    <Input type="password" placeholder="••••••••" disabled />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Confirmar Senha</label>
                                    <Input type="password" placeholder="••••••••" disabled />
                                </div>
                            </div>
                            <div className="flex justify-end mt-2">
                                <Button disabled variant="secondary">Alterar Senha</Button>
                            </div>
                            <p className="text-xs text-muted-foreground text-center">
                                Autenticação gerenciada externamente (em breve).
                            </p>
                        </div>
                    </div>

                    {/* Integrações (Placeholder) */}
                    <div className="rounded-xl border bg-card p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <Smartphone className="h-5 w-5 text-primary" />
                            <h3 className="text-lg font-semibold">Integrações</h3>
                        </div>

                        <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                    <Smartphone className="h-5 w-5" />
                                </div>
                                <div>
                                    <h4 className="font-medium">WhatsApp</h4>
                                    <p className="text-sm text-muted-foreground">Receba relatórios e alertas.</p>
                                </div>
                            </div>
                            <Button variant="outline" size="sm" disabled>Conectar</Button>
                        </div>
                         <p className="text-xs text-muted-foreground mt-3">
                            Integração via n8n em desenvolvimento.
                        </p>
                    </div>

                </div>
            </div>
        </div>
    )
}
