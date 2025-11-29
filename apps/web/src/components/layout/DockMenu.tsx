// Simple Money - Dock Menu Component
// Menu dock inferior usando MagicUI

import { LayoutDashboard, ArrowLeftRight, PiggyBank, Settings, TrendingUp, PieChart, MessageSquare, Zap } from 'lucide-react'
import { Dock, DockIcon } from '@/components/ui/dock'
import { useLocation } from 'wouter'

const dockItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/dashboard',
  },
  {
    id: 'transactions',
    label: 'Transações',
    icon: ArrowLeftRight,
    href: '/transactions',
  },
  {
    id: 'ai-chat',
    label: 'CFO Virtual',
    icon: MessageSquare,
    href: '/ai-chat',
  },
  {
    id: 'ai-insights',
    label: 'Insights',
    icon: Zap,
    href: '/ai-insights',
  },
  {
    id: 'forecast',
    label: 'Previsões',
    icon: TrendingUp,
    href: '/forecast',
  },
  {
    id: 'analytics',
    label: 'Análise',
    icon: PieChart,
    href: '/analytics',
  },
  {
    id: 'savings',
    label: 'Caixinhas',
    icon: PiggyBank,
    href: '/savings',
  },
  {
    id: 'settings',
    label: 'Configurações',
    icon: Settings,
    href: '/settings',
  },
]

export function DockMenu() {
  const [location, setLocation] = useLocation()

  return (
    <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 md:bottom-8">
      <Dock>
        {dockItems.map((item) => {
          const Icon = item.icon
          const isActive = location === item.href

          return (
            <DockIcon
              key={item.id}
              onClick={() => setLocation(item.href)}
              className={isActive ? 'bg-primary/20' : ''}
            >
              <Icon
                className={`h-5 w-5 ${isActive ? 'text-primary' : 'text-muted-foreground'}`}
              />
            </DockIcon>
          )
        })}
      </Dock>
    </div>
  )
}

