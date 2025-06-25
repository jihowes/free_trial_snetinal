'use client'

import { useState } from 'react'
import { getServiceIcon, getFallbackIcon, ServiceIcon as ServiceIconType } from '@/lib/serviceIcons'
import { Calendar } from 'lucide-react'

interface ServiceIconProps {
  serviceName: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
  showFallback?: boolean
}

export function ServiceIcon({ 
  serviceName, 
  size = 'md', 
  className = '',
  showFallback = true 
}: ServiceIconProps) {
  const [imageError, setImageError] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  const serviceIcon = getServiceIcon(serviceName)
  const fallbackIcon = getFallbackIcon()
  const iconToUse = serviceIcon || fallbackIcon

  // Size classes
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  // If no service icon found and fallback is disabled, show nothing
  if (!serviceIcon && !showFallback) {
    return null
  }

  // If image failed to load or no service icon, show fallback
  if (imageError || !serviceIcon) {
    return (
      <div className={`
        ${sizeClasses[size]} 
        rounded-lg flex items-center justify-center bg-slate-500/20 text-slate-400
        ${className}
      `}>
        <Calendar className={size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-4 h-4' : 'w-6 h-6'} />
      </div>
    )
  }

  return (
    <div className={`
      ${sizeClasses[size]} 
      rounded-lg flex items-center justify-center bg-white/10 backdrop-blur-sm
      ${className}
      ${!imageLoaded ? 'animate-pulse bg-slate-500/20' : ''}
    `}>
      <img
        src={iconToUse.path}
        alt={iconToUse.alt}
        className={`
          ${size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-6 h-6' : 'w-8 h-8'}
          object-contain transition-opacity duration-200
          ${imageLoaded ? 'opacity-100' : 'opacity-0'}
        `}
        onLoad={() => setImageLoaded(true)}
        onError={() => setImageError(true)}
      />
    </div>
  )
} 