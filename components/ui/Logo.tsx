'use client'

import React, { useEffect, useState } from 'react'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  containerSize?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export function Logo({ size = 'md', containerSize, className = '' }: LogoProps) {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    // Use a longer delay to ensure hydration is completely finished
    const timer = setTimeout(() => {
      setMounted(true)
    }, 500)
    
    return () => clearTimeout(timer)
  }, [])

  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20',
    xl: 'w-24 h-24'
  }

  const containerSizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20'
  }

  // Use containerSize if provided, otherwise use size
  const actualContainerSize = containerSize || size
  const containerClass = containerSizeClasses[actualContainerSize]
  const logoClass = sizeClasses[size]

  return (
    <div className={`flex items-center justify-center gap-4 ${className}`} suppressHydrationWarning>
      {/* Animated Eye of Sentinel Logo */}
      <div className={`${containerClass} relative flex items-center justify-center ${mounted ? 'sentinel-logo' : ''}`}>
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${logoClass}`}>
          <defs>
            <radialGradient id="eye-fire" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffee00" />
              <stop offset="60%" stopColor="#ff8c00" />
              <stop offset="100%" stopColor="#ff4500" />
            </radialGradient>
          </defs>

          {/* Fiery Eye of Sentinel - Centered */}
          <g className={mounted ? 'sauron-eye' : ''}>
            <path d="M75 100 C 90 80, 110 80, 125 100 C 110 120, 90 120, 75 100 Z" fill="url(#eye-fire)" />
            <ellipse cx="100" cy="100" rx="4" ry="18" fill="#0d1117" stroke="#111" strokeWidth="1.5"/>
          </g>

        </svg>
      </div>

      {/* Premium Typography */}
      <div className="flex flex-col items-start justify-center text-left">
        <h1 className="text-4xl font-black tracking-tight text-gray-200">
          FREE TRIAL <span className="text-orange-500">SENTINEL</span>
        </h1>
        <p className="text-sm text-gray-400 font-semibold tracking-wider uppercase mt-1 whitespace-nowrap">
          the all seeing eye of the free trial
        </p>
      </div>
    </div>
  )
}

export function LogoIcon({ size = 'md', containerSize, className = '' }: LogoProps) {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    // Use a longer delay to ensure hydration is completely finished
    const timer = setTimeout(() => {
      setMounted(true)
    }, 500)
    
    return () => clearTimeout(timer)
  }, [])

  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20',
    xl: 'w-24 h-24'
  }

  const containerSizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20'
  }

  // Use containerSize if provided, otherwise use size
  const actualContainerSize = containerSize || size
  const containerClass = containerSizeClasses[actualContainerSize]
  const logoClass = sizeClasses[size]

  // Always render the static version first to prevent hydration issues
  return (
    <div className={`${containerClass} relative flex items-center justify-center ${mounted ? 'sentinel-logo' : ''} ${className}`} suppressHydrationWarning>
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${logoClass}`}>
          <defs>
            <radialGradient id="eye-fire" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffee00" />
              <stop offset="60%" stopColor="#ff8c00" />
              <stop offset="100%" stopColor="#ff4500" />
            </radialGradient>
          </defs>

          {/* Fiery Eye of Sentinel - Centered */}
          <g className={mounted ? 'sauron-eye' : ''}>
            <path d="M75 100 C 90 80, 110 80, 125 100 C 110 120, 90 120, 75 100 Z" fill="url(#eye-fire)" />
            <ellipse cx="100" cy="100" rx="4" ry="18" fill="#0d1117" stroke="#111" strokeWidth="1.5"/>
          </g>

        </svg>
    </div>
  )
} 