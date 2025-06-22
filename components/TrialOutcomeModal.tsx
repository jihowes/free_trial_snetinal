'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, Clock, DollarSign } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Dialog, DialogHeader, DialogTitle } from '@/components/ui/Dialog'
import * as DialogPrimitive from "@radix-ui/react-dialog"

interface TrialOutcomeModalProps {
  isOpen: boolean
  onClose: () => void
  trial: {
    id: string
    service_name: string
    end_date: string
  }
  onOutcomeSelect: (trialId: string, outcome: 'kept' | 'cancelled' | 'expired') => void
}

// Custom DialogContent without close button
const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
    <DialogPrimitive.Content
      ref={ref}
      className={`fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg ${className}`}
      {...props}
    >
      {children}
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

export function TrialOutcomeModal({ isOpen, onClose, trial, onOutcomeSelect }: TrialOutcomeModalProps) {
  const [selectedOutcome, setSelectedOutcome] = useState<'kept' | 'cancelled' | 'expired' | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleOutcomeSelect = async (outcome: 'kept' | 'cancelled' | 'expired') => {
    setSelectedOutcome(outcome)
    setIsSubmitting(true)
    
    try {
      await onOutcomeSelect(trial.id, outcome)
      onClose()
    } catch (error) {
      console.error('Error updating trial outcome:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const outcomes = [
    {
      key: 'kept' as const,
      title: 'I decided to keep it',
      description: 'You chose to continue with the paid service',
      icon: DollarSign,
      color: 'text-green-400',
      bgColor: 'bg-green-500/20',
      borderColor: 'border-green-500/30'
    },
    {
      key: 'cancelled' as const,
      title: 'I cancelled it',
      description: 'You successfully cancelled before being charged',
      icon: CheckCircle,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
      borderColor: 'border-blue-500/30'
    },
    {
      key: 'expired' as const,
      title: 'I forgot to cancel',
      description: 'The trial expired without action',
      icon: Clock,
      color: 'text-red-400',
      bgColor: 'bg-red-500/20',
      borderColor: 'border-red-500/30'
    }
  ]

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-md bg-slate-800/90 border border-slate-700/50 backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle className="text-white text-xl font-bold">
            What happened with {trial.service_name}?
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-6">
          <p className="text-slate-300 text-sm">
            Your trial for <span className="font-semibold text-white">{trial.service_name}</span> has ended. 
            Let us know what happened so we can better assist you.
          </p>
          
          <div className="space-y-3">
            {outcomes.map((outcome) => (
              <motion.button
                key={outcome.key}
                onClick={() => handleOutcomeSelect(outcome.key)}
                disabled={isSubmitting}
                className={`
                  w-full p-4 rounded-lg border transition-all duration-200 text-left
                  ${outcome.borderColor} ${outcome.bgColor}
                  hover:bg-opacity-30 hover:scale-[1.02] active:scale-[0.98]
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${outcome.bgColor}`}>
                    <outcome.icon className={`w-5 h-5 ${outcome.color}`} />
                  </div>
                  <div>
                    <h3 className={`font-semibold ${outcome.color}`}>
                      {outcome.title}
                    </h3>
                    <p className="text-sm text-slate-400">
                      {outcome.description}
                    </p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
          
          {isSubmitting && (
            <div className="flex items-center justify-center py-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-6 h-6 border-2 border-fantasy-crimson border-t-transparent rounded-full"
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
} 