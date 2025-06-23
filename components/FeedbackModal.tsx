'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Star, Bug, Lightbulb, MessageCircle, Palette } from 'lucide-react'
import { Button } from './ui/Button'
import { Dialog } from './ui/Dialog'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface FeedbackModalProps {
  isOpen: boolean
  onClose: () => void
  userId: string
}

type FeedbackType = 'bug' | 'feature' | 'general' | 'ui_ux'

const feedbackTypes = [
  { value: 'bug', label: 'Bug Report', icon: Bug, color: 'text-red-400' },
  { value: 'feature', label: 'Feature Request', icon: Lightbulb, color: 'text-blue-400' },
  { value: 'general', label: 'General Feedback', icon: MessageCircle, color: 'text-green-400' },
  { value: 'ui_ux', label: 'UI/UX Suggestion', icon: Palette, color: 'text-purple-400' }
] as const

export function FeedbackModal({ isOpen, onClose, userId }: FeedbackModalProps) {
  const [feedbackType, setFeedbackType] = useState<FeedbackType>('general')
  const [message, setMessage] = useState('')
  const [rating, setRating] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const supabase = createClientComponentClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!message.trim()) {
      return
    }

    setIsSubmitting(true)
    
    try {
      const { error } = await supabase
        .from('feedback')
        .insert({
          user_id: userId,
          feedback_type: feedbackType,
          message: message.trim(),
          rating: rating
        })

      if (error) {
        console.error('Error submitting feedback:', error)
        throw error
      }

      setSubmitSuccess(true)
      setTimeout(() => {
        handleClose()
      }, 2000)
    } catch (error) {
      console.error('Failed to submit feedback:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setFeedbackType('general')
    setMessage('')
    setRating(null)
    setSubmitSuccess(false)
    onClose()
  }

  const renderStars = () => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            className={`p-1 transition-colors ${
              rating && star <= rating 
                ? 'text-yellow-400' 
                : 'text-slate-400 hover:text-yellow-300'
            }`}
          >
            <Star className={`w-5 h-5 ${rating && star <= rating ? 'fill-current' : ''}`} />
          </button>
        ))}
      </div>
    )
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={handleClose}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-4 z-50 flex items-center justify-center"
          >
            <div className="bg-slate-900 border border-slate-700 rounded-lg shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-white">Send Feedback</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClose}
                    className="text-slate-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                {submitSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-8"
                  >
                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">Thank you!</h3>
                    <p className="text-slate-400">Your feedback has been submitted successfully.</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Feedback Type */}
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-3">
                        What type of feedback is this?
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {feedbackTypes.map((type) => {
                          const Icon = type.icon
                          return (
                            <button
                              key={type.value}
                              type="button"
                              onClick={() => setFeedbackType(type.value as FeedbackType)}
                              className={`
                                p-3 rounded-lg border transition-all duration-200 text-left
                                ${feedbackType === type.value
                                  ? 'border-fantasy-crimson bg-fantasy-crimson/10 text-white'
                                  : 'border-slate-600 bg-slate-800/50 text-slate-400 hover:border-slate-500 hover:bg-slate-800'
                                }
                              `}
                            >
                              <div className="flex items-center gap-2">
                                <Icon className={`w-4 h-4 ${type.color}`} />
                                <span className="text-sm font-medium">{type.label}</span>
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-2">
                        Your feedback
                      </label>
                      <textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Tell us what you think, what you'd like to see, or if you found any issues..."
                        className="w-full h-32 px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-fantasy-crimson/50 focus:border-fantasy-crimson/50 resize-none"
                        required
                      />
                    </div>

                    {/* Rating */}
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        How would you rate your experience? (optional)
                      </label>
                      {renderStars()}
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-3 pt-4">
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={handleClose}
                        className="flex-1"
                        disabled={isSubmitting}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-fantasy-crimson to-fantasy-molten hover:from-fantasy-molten hover:to-fantasy-crimson"
                        disabled={isSubmitting || !message.trim()}
                      >
                        {isSubmitting ? 'Submitting...' : 'Send Feedback'}
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        </Dialog>
      )}
    </AnimatePresence>
  )
} 