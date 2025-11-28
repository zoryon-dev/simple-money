// Simple Money - Scope Filter Component
// Filtro de escopo (Todos/Pessoal/Negócio)

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ScopeFilterProps {
  value: 'all' | 'personal' | 'business'
  onChange: (value: 'all' | 'personal' | 'business') => void
}

export function ScopeFilter({ value, onChange }: ScopeFilterProps) {
  return (
    <div className="flex gap-2">
      <Button
        variant={value === 'all' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onChange('all')}
        className={cn(value === 'all' && 'bg-primary text-primary-foreground')}
      >
        Todos
      </Button>
      <Button
        variant={value === 'personal' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onChange('personal')}
        className={cn(
          value === 'personal' && 'bg-primary text-primary-foreground'
        )}
      >
        Pessoal
      </Button>
      <Button
        variant={value === 'business' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onChange('business')}
        className={cn(
          value === 'business' && 'bg-primary text-primary-foreground'
        )}
      >
        Negócio
      </Button>
    </div>
  )
}

