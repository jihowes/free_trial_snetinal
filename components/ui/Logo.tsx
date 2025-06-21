import React from 'react'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Logo({ size = 'md', className = '' }: LogoProps) {
  const sizeClasses = {
    sm: 'w-24 h-24',
    md: 'w-32 h-32',
    lg: 'w-40 h-40'
  }

  return (
    <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
      {/* Animated Eye of Sentinel Logo */}
      <div className={`${sizeClasses[size]} relative sentinel-logo`}>
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <defs>
            <radialGradient id="eye-fire" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffee00" />
              <stop offset="60%" stopColor="#ff8c00" />
              <stop offset="100%" stopColor="#ff4500" />
            </radialGradient>
            <linearGradient id="body-metal" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#3a4a63" />
              <stop offset="50%" stopColor="#2c3a4f" />
              <stop offset="100%" stopColor="#1e2a3a" />
            </linearGradient>
            <linearGradient id="horn-metal" x1="0.5" y1="0" x2="0.5" y2="1">
              <stop offset="0%" stopColor="#2c3a4f" />
              <stop offset="100%" stopColor="#1e2a3a" />
            </linearGradient>
            <linearGradient id="shield-border" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#7a8eb3" />
              <stop offset="100%" stopColor="#4d5f7a" />
            </linearGradient>
          </defs>

          {/* Hexagonal Shield Body */}
          <path d="M100 50 L150 75 L150 125 L100 150 L50 125 L50 75 Z" fill="url(#body-metal)" stroke="url(#shield-border)" strokeWidth="3"/>
          
          {/* Fiery Eye of Sentinel - Centered and Enlarged */}
          <g className="sauron-eye" transform="scale(1.25)">
            <path d="M75 100 C 90 80, 110 80, 125 100 C 110 120, 90 120, 75 100 Z" fill="url(#eye-fire)" />
            <ellipse cx="100" cy="100" rx="4" ry="18" fill="#0d1117" stroke="#111" strokeWidth="1.5"/>
          </g>

        </svg>
      </div>

      {/* Premium Typography */}
      <div className="flex flex-col items-center">
        <h1 className="text-4xl font-black tracking-tight text-gray-200">
          FREE TRIAL <span className="text-orange-500">SENTINEL</span>
        </h1>
        <p className="text-sm text-gray-400 font-semibold tracking-wider uppercase mt-1">
          the all seeing eye of the free trial
        </p>
      </div>
    </div>
  )
}

export function LogoIcon({ size = 'md', className = '' }: LogoProps) {
  const sizeClasses = {
    sm: 'w-24 h-24',
    md: 'w-32 h-32',
    lg: 'w-40 h-40'
  }

  return (
    <div className={`${sizeClasses[size]} relative sentinel-logo ${className}`}>
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <defs>
            <radialGradient id="eye-fire" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffee00" />
              <stop offset="60%" stopColor="#ff8c00" />
              <stop offset="100%" stopColor="#ff4500" />
            </radialGradient>
            <linearGradient id="body-metal" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#3a4a63" />
              <stop offset="50%" stopColor="#2c3a4f" />
              <stop offset="100%" stopColor="#1e2a3a" />
            </linearGradient>
            <linearGradient id="horn-metal" x1="0.5" y1="0" x2="0.5" y2="1">
              <stop offset="0%" stopColor="#2c3a4f" />
              <stop offset="100%" stopColor="#1e2a3a" />
            </linearGradient>
            <linearGradient id="shield-border" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#7a8eb3" />
              <stop offset="100%" stopColor="#4d5f7a" />
            </linearGradient>
          </defs>

          {/* Hexagonal Shield Body */}
          <path d="M100 50 L150 75 L150 125 L100 150 L50 125 L50 75 Z" fill="url(#body-metal)" stroke="url(#shield-border)" strokeWidth="3"/>
          
          {/* Fiery Eye of Sentinel - Centered and Enlarged */}
          <g className="sauron-eye" transform="scale(1.25)">
            <path d="M75 100 C 90 80, 110 80, 125 100 C 110 120, 90 120, 75 100 Z" fill="url(#eye-fire)" />
            <ellipse cx="100" cy="100" rx="4" ry="18" fill="#0d1117" stroke="#111" strokeWidth="1.5"/>
          </g>

        </svg>
    </div>
  )
} 