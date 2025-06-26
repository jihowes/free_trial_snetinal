'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useCurrency } from './CurrencyContext'

interface CurrencySelectorProps {
  className?: string
}

export function CurrencySelector({ className = '' }: CurrencySelectorProps) {
  const { currency, currencies, updateCurrency, mounted } = useCurrency()
  const [isOpen, setIsOpen] = useState(false)

  const handleCurrencySelect = (newCurrency: any) => {
    updateCurrency(newCurrency)
    setIsOpen(false)
  }

  if (!mounted) {
    return (
      <div className={`relative ${className}`}>
        <Button
          variant="secondary"
          className="flex items-center gap-2 bg-slate-800/50 border border-slate-700/50 hover:bg-slate-700/50 text-slate-400 min-w-[80px]"
        >
          <span className="text-sm font-medium">$</span>
          <ChevronDown className="w-3 h-3" />
        </Button>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      <Button
        variant="secondary"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-slate-800/50 border border-slate-700/50 hover:bg-slate-700/50 text-slate-400 min-w-[80px]"
      >
        <span className="text-sm font-medium">{currency.symbol}</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-1 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
          {currencies.map((curr) => (
            <button
              key={curr.code}
              onClick={() => handleCurrencySelect(curr)}
              className={`w-full px-3 py-2 text-left text-sm hover:bg-slate-700/50 transition-colors ${
                currency.code === curr.code
                  ? 'bg-slate-700/50 text-white'
                  : 'text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{curr.symbol}</span>
                <span className="text-xs text-slate-400">{curr.name}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
} 