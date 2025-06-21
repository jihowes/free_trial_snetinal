'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

interface OctopusMascotProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'default' | 'happy' | 'sleepy' | 'excited'
  className?: string
  animated?: boolean
}

export function OctopusMascot({ 
  size = 'md', 
  variant = 'default', 
  className = '',
  animated = true 
}: OctopusMascotProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isClicked, setIsClicked] = useState(false)

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  }

  const tentacleVariants = {
    default: {
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    },
    hover: {
      rotate: [0, 10, -10, 0],
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "easeInOut"
      }
    },
    click: {
      scale: [1, 1.1, 1],
      rotate: [0, 15, -15, 0],
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  }

  const bodyVariants = {
    default: {
      scale: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.05,
      y: -2,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    click: {
      scale: [1, 1.1, 1],
      y: [0, -5, 0],
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  }

  const eyeVariants = {
    default: {
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.1,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    click: {
      scale: [1, 1.2, 1],
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  }

  const getEyeExpression = () => {
    switch (variant) {
      case 'happy':
        return '😊'
      case 'sleepy':
        return '😴'
      case 'excited':
        return '🤩'
      default:
        return '👀'
    }
  }

  const handleClick = () => {
    if (!animated) return
    setIsClicked(true)
    setTimeout(() => setIsClicked(false), 300)
  }

  return (
    <motion.div
      className={`relative ${sizeClasses[size]} ${className}`}
      onMouseEnter={() => animated && setIsHovered(true)}
      onMouseLeave={() => animated && setIsHovered(false)}
      onClick={handleClick}
      whileHover={animated ? { cursor: 'pointer' } : {}}
    >
      {/* Main Body */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600 rounded-full shadow-lg"
        variants={bodyVariants}
        animate={isClicked ? 'click' : isHovered ? 'hover' : 'default'}
      />

      {/* Eyes */}
      <div className="absolute top-1/4 left-1/4 right-1/4 flex justify-between">
        <motion.div
          className="w-2 h-2 bg-white rounded-full flex items-center justify-center text-xs"
          variants={eyeVariants}
          animate={isClicked ? 'click' : isHovered ? 'hover' : 'default'}
        >
          <span className="text-[8px]">{getEyeExpression()}</span>
        </motion.div>
        <motion.div
          className="w-2 h-2 bg-white rounded-full flex items-center justify-center text-xs"
          variants={eyeVariants}
          animate={isClicked ? 'click' : isHovered ? 'hover' : 'default'}
        >
          <span className="text-[8px]">{getEyeExpression()}</span>
        </motion.div>
      </div>

      {/* Tentacles */}
      {animated && (
        <>
          {/* Top tentacles */}
          <motion.div
            className="absolute -top-1 left-1/2 w-1 h-3 bg-purple-400 rounded-full origin-bottom"
            variants={tentacleVariants}
            animate={isClicked ? 'click' : isHovered ? 'hover' : 'default'}
            style={{ transformOrigin: 'bottom center' }}
          />
          <motion.div
            className="absolute -top-1 left-1/3 w-1 h-2 bg-purple-400 rounded-full origin-bottom"
            variants={tentacleVariants}
            animate={isClicked ? 'click' : isHovered ? 'hover' : 'default'}
            style={{ transformOrigin: 'bottom center' }}
          />
          <motion.div
            className="absolute -top-1 right-1/3 w-1 h-2 bg-purple-400 rounded-full origin-bottom"
            variants={tentacleVariants}
            animate={isClicked ? 'click' : isHovered ? 'hover' : 'default'}
            style={{ transformOrigin: 'bottom center' }}
          />

          {/* Side tentacles */}
          <motion.div
            className="absolute top-1/2 -left-1 w-1 h-4 bg-purple-400 rounded-full origin-left"
            variants={tentacleVariants}
            animate={isClicked ? 'click' : isHovered ? 'hover' : 'default'}
            style={{ transformOrigin: 'left center' }}
          />
          <motion.div
            className="absolute top-1/2 -right-1 w-1 h-4 bg-purple-400 rounded-full origin-right"
            variants={tentacleVariants}
            animate={isClicked ? 'click' : isHovered ? 'hover' : 'default'}
            style={{ transformOrigin: 'right center' }}
          />

          {/* Bottom tentacles */}
          <motion.div
            className="absolute -bottom-1 left-1/4 w-1 h-3 bg-purple-400 rounded-full origin-top"
            variants={tentacleVariants}
            animate={isClicked ? 'click' : isHovered ? 'hover' : 'default'}
            style={{ transformOrigin: 'top center' }}
          />
          <motion.div
            className="absolute -bottom-1 right-1/4 w-1 h-3 bg-purple-400 rounded-full origin-top"
            variants={tentacleVariants}
            animate={isClicked ? 'click' : isHovered ? 'hover' : 'default'}
            style={{ transformOrigin: 'top center' }}
          />
          <motion.div
            className="absolute -bottom-1 left-1/2 w-1 h-2 bg-purple-400 rounded-full origin-top"
            variants={tentacleVariants}
            animate={isClicked ? 'click' : isHovered ? 'hover' : 'default'}
            style={{ transformOrigin: 'top center' }}
          />
        </>
      )}

      {/* Glow effect */}
      <div className="absolute inset-0 bg-purple-400/20 rounded-full blur-md -z-10" />
    </motion.div>
  )
}

// Floating Octopus for background decoration
export function FloatingOctopus({ className = '' }: { className?: string }) {
  return (
    <motion.div
      className={`absolute ${className}`}
      animate={{
        y: [0, -20, 0],
        rotate: [0, 5, -5, 0],
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <OctopusMascot size="sm" variant="happy" animated={false} />
    </motion.div>
  )
}

// Octopus with message bubble
export function OctopusWithMessage({ 
  message, 
  size = 'md',
  className = '' 
}: { 
  message: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string 
}) {
  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <OctopusMascot size={size} variant="excited" />
      <motion.div
        className="bg-card border border-border rounded-lg px-3 py-2 shadow-lg"
        initial={{ opacity: 0, scale: 0.8, x: -10 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        <p className="text-sm text-foreground font-medium">{message}</p>
      </motion.div>
    </div>
  )
} 