'use client'

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'

export interface Currency {
  code: string
  symbol: string
  name: string
}

const CURRENCIES: Currency[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc' },
  { code: 'SEK', symbol: 'kr', name: 'Swedish Krona' },
  { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone' },
  { code: 'DKK', symbol: 'kr', name: 'Danish Krone' },
  { code: 'PLN', symbol: 'zł', name: 'Polish Złoty' },
  { code: 'CZK', symbol: 'Kč', name: 'Czech Koruna' },
  { code: 'HUF', symbol: 'Ft', name: 'Hungarian Forint' },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real' },
  { code: 'MXN', symbol: '$', name: 'Mexican Peso' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
  { code: 'HKD', symbol: 'HK$', name: 'Hong Kong Dollar' },
  { code: 'KRW', symbol: '₩', name: 'South Korean Won' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
]

const STORAGE_KEY = 'sentinel-currency'

interface CurrencyContextType {
  currency: Currency
  currencies: Currency[]
  updateCurrency: (newCurrency: Currency) => void
  formatCurrency: (amount: number) => string
  mounted: boolean
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>(CURRENCIES[0]) // Default to USD
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Load currency from localStorage on mount
    if (typeof window !== 'undefined') {
      const savedCurrency = localStorage.getItem(STORAGE_KEY)
      if (savedCurrency) {
        try {
          const parsed = JSON.parse(savedCurrency)
          const found = CURRENCIES.find(c => c.code === parsed.code)
          if (found) {
            setCurrency(found)
          }
        } catch (error) {
          console.error('Error parsing saved currency:', error)
        }
      }
    }
  }, [])

  const updateCurrency = useCallback((newCurrency: Currency) => {
    setCurrency(newCurrency)
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newCurrency))
    }
  }, [])

  const formatCurrency = useCallback((amount: number): string => {
    if (!mounted) {
      // Return simple formatting during SSR
      return `$${amount.toFixed(2)}`
    }
    
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency.code,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount)
    } catch (error) {
      // Fallback to simple formatting if Intl.NumberFormat fails
      return `${currency.symbol}${amount.toFixed(2)}`
    }
  }, [currency, mounted])

  const value = {
    currency,
    currencies: CURRENCIES,
    updateCurrency,
    formatCurrency,
    mounted,
  }

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider')
  }
  return context
} 