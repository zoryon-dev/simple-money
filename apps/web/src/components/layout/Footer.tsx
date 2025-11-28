import { Heart } from 'lucide-react'
import { useLocation } from 'wouter'

export function Footer() {
  const [, setLocation] = useLocation()

  return (
    <footer className="border-t py-12 bg-muted/20 mt-auto">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2 space-y-4">
            <h3 className="font-bold text-lg flex items-center gap-2">Simple Money</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Simplificando a gestão financeira para pessoas e empresas. 
              Tome o controle do seu dinheiro hoje mesmo.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Plataforma</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><button onClick={() => setLocation('/')} className="hover:text-primary transition-colors">Início</button></li>
              <li><button onClick={() => setLocation('/plans')} className="hover:text-primary transition-colors">Planos</button></li>
              <li><button onClick={() => setLocation('/login')} className="hover:text-primary transition-colors">Login</button></li>
              <li><button onClick={() => setLocation('/register')} className="hover:text-primary transition-colors">Cadastro</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Legal & Suporte</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><button onClick={() => setLocation('/terms')} className="hover:text-primary transition-colors">Termos de Uso</button></li>
              <li><button onClick={() => setLocation('/privacy')} className="hover:text-primary transition-colors">Privacidade</button></li>
              <li><button onClick={() => setLocation('/support')} className="hover:text-primary transition-colors">Central de Ajuda</button></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Simple Money. Todos os direitos reservados.</p>
          
          <div className="flex items-center gap-1">
            <span>Feito com</span>
            <Heart className="h-4 w-4 text-red-500 fill-red-500 animate-pulse" />
            <span>pelo time Zoryon</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
