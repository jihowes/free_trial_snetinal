'use client'

import { motion } from 'framer-motion'
import { ExternalLink, Star, Globe, DollarSign } from 'lucide-react'
import { Button } from './ui/Button'
import { Card } from './ui/Card'
import { Badge } from './ui/Badge'
import { ServiceIcon } from './ServiceIcon'
import { useState } from 'react'
import { CuratedTrial } from '@/lib/fetchTrials'

interface ExploreTrialCardProps {
  trial: CuratedTrial
  index: number
}

export function ExploreTrialCard({ trial, index }: ExploreTrialCardProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleTryFree = async () => {
    setIsLoading(true)
    
    try {
      // Track the click
      await fetch('/api/track-click', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          trial_id: trial.id,
        }),
      })

      // Open affiliate link in new tab
      window.open(trial.affiliate_link, '_blank', 'noopener,noreferrer')
    } catch (error) {
      console.error('Error tracking click:', error)
      // Still open the link even if tracking fails
      window.open(trial.affiliate_link, '_blank', 'noopener,noreferrer')
    } finally {
      setIsLoading(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-400 bg-green-500/20 border-green-500/30'
    if (score >= 70) return 'text-amber-400 bg-amber-500/20 border-amber-500/30'
    return 'text-slate-400 bg-slate-500/20 border-slate-500/30'
  }

  const getScoreIcon = (score: number) => {
    if (score >= 85) return '⭐'
    if (score >= 70) return '✨'
    return '📊'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.4, 
        delay: index * 0.1,
        ease: "easeOut"
      }}
      whileHover={{ 
        y: -2, 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      className="w-full"
    >
      <Card className="relative overflow-hidden border-0 shadow-lg transition-all duration-300 bg-gradient-to-r from-slate-800/20 to-slate-700/20 border-slate-600/30 shadow-slate-500/10 hover:shadow-xl hover:shadow-fantasy-crimson/20">
        {/* Animated background glow */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-slate-500/5" />
        
        <div className="relative p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <ServiceIcon serviceName={trial.service_name} size="lg" />
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-white truncate">
                  {trial.service_name}
                </h3>
                <p className="text-sm text-slate-400">
                  {trial.trial_length_days === 0 ? 'Free' : `${trial.trial_length_days}-day trial`}
                </p>
              </div>
            </div>
            
            {/* Sentinel Score Badge */}
            <Badge className={`${getScoreColor(trial.sentinel_score)} text-xs font-medium`}>
              <span className="mr-1">{getScoreIcon(trial.sentinel_score)}</span>
              {trial.sentinel_score}
            </Badge>
          </div>

          {/* Description */}
          {trial.description && (
            <p className="text-sm text-slate-300 mb-4 line-clamp-2">
              {trial.description}
            </p>
          )}

          {/* Category and Geo Badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge className="text-xs bg-slate-500/20 border-slate-500/30 text-slate-300">
              {trial.category}
            </Badge>
            
            {/* Geo availability */}
            <div className="flex items-center gap-1">
              {trial.geo_availability.map((flag, idx) => (
                <span key={idx} className="text-sm" title={flag === '🌍' ? 'Worldwide' : flag === '🇺🇸' ? 'United States' : flag === '🇦🇺' ? 'Australia' : flag}>
                  {flag}
                </span>
              ))}
            </div>
          </div>

          {/* Price and CTA */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {trial.monthly_price && trial.monthly_price > 0 ? (
                <>
                  <DollarSign className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-300">
                    ${trial.monthly_price.toFixed(2)}/{trial.billing_frequency}
                  </span>
                </>
              ) : (
                <span className="text-sm text-green-400 font-medium">Free</span>
              )}
            </div>

            <Button
              onClick={handleTryFree}
              disabled={isLoading}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium px-4 py-2 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Opening...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <span>Try Free</span>
                  <ExternalLink className="w-4 h-4" />
                </div>
              )}
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  )
} 