import React from 'react'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export function Logo({ size = 'md', className = '' }: LogoProps) {
  const sizeClasses = {
    sm: 'w-24 h-24',
    md: 'w-32 h-32',
    lg: 'w-40 h-40',
    xl: 'w-48 h-48'
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
          </defs>

          {/* Fiery Eye of Sentinel - Centered */}
          <g className="sauron-eye">
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
    lg: 'w-40 h-40',
    xl: 'w-48 h-48'
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
          </defs>

          {/* Fiery Eye of Sentinel - Centered */}
          <g className="sauron-eye">
            <path d="M75 100 C 90 80, 110 80, 125 100 C 110 120, 90 120, 75 100 Z" fill="url(#eye-fire)" />
            <ellipse cx="100" cy="100" rx="4" ry="18" fill="#0d1117" stroke="#111" strokeWidth="1.5"/>
          </g>

        </svg>
    </div>
  )
} 