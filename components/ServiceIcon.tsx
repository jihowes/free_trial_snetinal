'use client'

import { useState, useEffect, useRef } from 'react'
import { ExternalLink } from 'lucide-react'

interface ServiceIconProps {
  serviceName: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
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
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const hasLoadedRef = useRef<Set<string>>(new Set())

  // Get the favicon URL for the service using our API
  const getFaviconUrl = (serviceName: string) => {
    const serviceUrls: Record<string, string> = {
      // Original services
      'Netflix': 'netflix.com',
      'Spotify Premium': 'spotify.com',
      'Disney+': 'disneyplus.com',
      'Hulu': 'hulu.com',
      'HBO Max': 'hbomax.com',
      'Amazon Prime': 'amazon.com',
      'Apple TV+': 'tv.apple.com',
      'Paramount+': 'paramountplus.com',
      'Apple Music': 'music.apple.com',
      'YouTube Music': 'music.youtube.com',
      'Steam': 'store.steampowered.com',
      'Xbox Game Pass': 'xbox.com',
      'Adobe Creative Cloud': 'adobe.com',
      'Microsoft 365': 'copilot.microsoft.com',
      
      // AI Tools
      'ChatGPT Plus': 'chat.openai.com',
      'Claude Pro': 'claude.ai',
      'Midjourney': 'midjourney.com',
      'Notion AI': 'notion.so',
      'Copy.ai': 'copy.ai',
      'Jasper': 'jasper.ai',
      'Runway ML': 'runwayml.com',
      'ElevenLabs': 'elevenlabs.io',
      'Synthesia': 'synthesia.io',
      
      // Productivity & Business
      'Notion': 'notion.so',
      'Figma': 'figma.com',
      'Canva Pro': 'canva.com',
      'Slack': 'slack.com',
      'Zoom Pro': 'zoom.us',
      'Trello Premium': 'trello.com',
      'Asana Premium': 'asana.com',
      'Monday.com': 'monday.com',
      'ClickUp': 'clickup.com',
      'Airtable': 'airtable.com',
      
      // Development & Tech
      'GitHub Copilot': 'github.com',
      'JetBrains All Products': 'jetbrains.com',
      'VS Code Pro': 'code.visualstudio.com',
      'Figma Dev Mode': 'figma.com',
      
      // Creative & Media
      'Adobe Lightroom': 'adobe.com',
      'Sketch': 'sketch.com',
      'Framer': 'framer.com',
      'Webflow': 'webflow.com',
      
      // Education & Learning
      'Coursera Plus': 'coursera.org',
      'Skillshare': 'skillshare.com',
      'MasterClass': 'masterclass.com',
      'Duolingo Plus': 'duolingo.com',
      'Brilliant': 'brilliant.org',
      
      // Health & Fitness
      'Headspace': 'headspace.com',
      'Calm': 'calm.com',
      'MyFitnessPal Premium': 'myfitnesspal.com',
      'Noom': 'noom.com',
      'Peloton App': 'onepeloton.com',
      
      // Finance & Business
      'Mint': 'mint.intuit.com',
      'YNAB': 'youneedabudget.com',
      'QuickBooks': 'quickbooks.intuit.com',
      'FreshBooks': 'freshbooks.com',
      'Stripe': 'stripe.com'
    }
    
    const domain = serviceUrls[serviceName]
    if (!domain) return null
    
    // Use stable URL without cache busting for better caching
    return `/api/favicon?url=${encodeURIComponent(domain)}`
  }

  // Initialize image URL and check if already loaded
  useEffect(() => {
    const url = getFaviconUrl(serviceName)
    setImageUrl(url)
    
    // If this service has already loaded successfully, mark it as loaded
    if (url && hasLoadedRef.current.has(url)) {
      setImageLoaded(true)
      setImageError(false)
    } else {
      setImageLoaded(false)
      setImageError(false)
    }
  }, [serviceName])

  // Enhanced size classes with better mobile responsiveness
  const sizeClasses = {
    sm: 'w-6 h-6 sm:w-7 sm:h-7',
    md: 'w-8 h-8 sm:w-10 sm:h-10',
    lg: 'w-12 h-12 sm:w-14 sm:h-14',
    xl: 'w-16 h-16 sm:w-20 sm:h-20'
  }

  // Icon sizes within the container
  const iconSizes = {
    sm: 'w-4 h-4 sm:w-5 sm:h-5',
    md: 'w-6 h-6 sm:w-7 sm:h-7',
    lg: 'w-8 h-8 sm:w-10 sm:h-10',
    xl: 'w-10 h-10 sm:w-12 sm:h-12'
  }

  // Get service initials for fallback
  const getServiceInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  // If no favicon URL or fallback is disabled, show nothing
  if (!imageUrl && !showFallback) {
    return null
  }

  // If image failed to load or no favicon URL, show initials fallback
  if (imageError || !imageUrl) {
    return (
      <div className={`
        ${sizeClasses[size]} 
        rounded-xl flex items-center justify-center 
        bg-gradient-to-br from-slate-600/30 to-slate-700/30 
        border border-slate-500/20 backdrop-blur-sm
        shadow-lg hover:shadow-xl transition-all duration-200
        ${className}
      `}>
        <span className={`${iconSizes[size]} text-slate-400 font-bold text-xs`}>
          {getServiceInitials(serviceName)}
        </span>
      </div>
    )
  }

  return (
    <div className={`
      ${sizeClasses[size]} 
      rounded-xl flex items-center justify-center 
      bg-gradient-to-br from-white/10 to-white/5 
      border border-white/10 backdrop-blur-sm
      shadow-lg hover:shadow-xl transition-all duration-200
      ${className}
      ${!imageLoaded ? 'animate-pulse bg-slate-500/20' : 'hover:scale-105'}
    `}>
      <img
        src={imageUrl}
        alt={`${serviceName} logo`}
        className={`
          ${iconSizes[size]}
          object-contain transition-all duration-200
          ${imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
          filter drop-shadow-sm
        `}
        onLoad={() => {
          console.log(`Favicon loaded successfully: ${imageUrl}`)
          setImageLoaded(true)
          // Cache this URL as successfully loaded
          if (imageUrl) {
            hasLoadedRef.current.add(imageUrl)
          }
        }}
        onError={(e) => {
          console.error(`Favicon failed to load: ${imageUrl}`, e)
          setImageError(true)
        }}
        loading="eager"
      />
    </div>
  )
} 