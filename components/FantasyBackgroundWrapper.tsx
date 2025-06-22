'use client'

import { useState, useEffect } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

interface FantasyBackgroundWrapperProps {
  children: React.ReactNode
  showEmbers?: boolean
  showEyeGlow?: boolean
  showFloatingEye?: boolean
  enableSound?: boolean
}

export default function FantasyBackgroundWrapper({
  children,
  showEmbers = true,
  showEyeGlow = true,
  showFloatingEye = true,
  enableSound = false
}: FantasyBackgroundWrapperProps) {
  const [isHoveringEye, setIsHoveringEye] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [mounted, setMounted] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Ambient sound effect (optional)
  useEffect(() => {
    if (!enableSound || isMuted || prefersReducedMotion || !mounted) return

    // Create ambient audio context for fire crackle effect
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    
    // Simple fire crackle effect using noise
    const createFireCrackle = () => {
      const bufferSize = audioContext.sampleRate * 0.1 // 100ms
      const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate)
      const output = buffer.getChannelData(0)
      
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() - 0.5) * 0.1
      }
      
      const source = audioContext.createBufferSource()
      source.buffer = buffer
      source.loop = true
      source.connect(audioContext.destination)
      source.start()
      
      return source
    }

    const crackle = createFireCrackle()
    
    return () => {
      crackle.stop()
      audioContext.close()
    }
  }, [enableSound, isMuted, prefersReducedMotion, mounted])

  // Ember particle animation - fixed positions to prevent hydration issues
  const emberPositions = [
    { left: '10%', top: '20%' },
    { left: '20%', top: '60%' },
    { left: '30%', top: '40%' },
    { left: '40%', top: '80%' },
    { left: '50%', top: '30%' },
    { left: '60%', top: '70%' },
    { left: '70%', top: '50%' },
    { left: '80%', top: '20%' },
    { left: '90%', top: '60%' },
    { left: '15%', top: '80%' },
    { left: '25%', top: '10%' },
    { left: '85%', top: '40%' }
  ]

  const emberVariants = {
    float: {
      y: [-20, -100],
      x: [0, 20],
      opacity: [0, 1, 0],
      scale: [0.5, 1, 0.5],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeOut" as const
      }
    }
  }

  // Eye glow animation
  const eyeGlowVariants = {
    pulse: {
      opacity: [0.3, 0.6, 0.3],
      scale: [1, 1.05, 1],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut" as const
      }
    }
  }

  // Floating eye animation
  const floatingEyeVariants = {
    float: {
      y: [0, -10, 0],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut" as const
      }
    },
    flare: {
      scale: [1, 1.2, 1],
      filter: [
        "brightness(1) drop-shadow(0 0 10px #d93e30)",
        "brightness(1.5) drop-shadow(0 0 20px #d93e30) drop-shadow(0 0 30px #e25822)",
        "brightness(1) drop-shadow(0 0 10px #d93e30)"
      ],
      transition: {
        duration: 0.3,
        ease: "easeInOut" as const
      }
    }
  }

  return (
    <div className="relative min-h-screen">
      {/* Base fantasy gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-black via-gray-900 via-red-950 to-red-900" />
      
      {/* Radial eye glow effect */}
      {showEyeGlow && mounted && (
        <div className="fixed inset-0 pointer-events-none">
          <motion.div
            className="absolute top-1/2 left-1/2 w-96 h-96 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20"
            style={{
              background: 'radial-gradient(circle, rgba(217, 62, 48, 0.3) 0%, rgba(226, 88, 34, 0.1) 50%, transparent 100%)'
            }}
            variants={eyeGlowVariants}
            animate="pulse"
          />
        </div>
      )}

      {/* SVG mist/cloud textures */}
      <div className="fixed inset-0 pointer-events-none opacity-10">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <radialGradient id="mist" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.1)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </radialGradient>
          </defs>
          <circle cx="20" cy="30" r="15" fill="url(#mist)" />
          <circle cx="80" cy="60" r="20" fill="url(#mist)" />
          <circle cx="40" cy="80" r="12" fill="url(#mist)" />
        </svg>
      </div>

      {/* Animated ember particles */}
      {showEmbers && mounted && !prefersReducedMotion && (
        <div className="fixed inset-0 pointer-events-none">
          {emberPositions.map((position, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-gradient-to-r from-orange-400 to-red-500 rounded-full"
              style={{
                left: position.left,
                top: position.top,
              }}
              variants={emberVariants}
              animate="float"
              initial={{ opacity: 0 }}
            />
          ))}
        </div>
      )}

      {/* Floating eye orb (easter egg) */}
      {showFloatingEye && mounted && (
        <motion.div
          className="fixed top-8 right-8 w-12 h-12 pointer-events-none z-10"
          variants={floatingEyeVariants}
          animate={isHoveringEye ? "flare" : "float"}
          onHoverStart={() => setIsHoveringEye(true)}
          onHoverEnd={() => setIsHoveringEye(false)}
        >
          <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
            <circle cx="12" cy="12" r="10" fill="rgba(217, 62, 48, 0.8)" />
            <circle cx="12" cy="12" r="6" fill="rgba(226, 88, 34, 0.9)" />
            <circle cx="12" cy="12" r="3" fill="rgba(244, 208, 63, 1)" />
            <circle cx="11" cy="11" r="1" fill="black" />
          </svg>
        </motion.div>
      )}

      {/* Sound toggle (if enabled) */}
      {enableSound && mounted && (
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="fixed top-4 left-4 z-20 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
          aria-label={isMuted ? "Enable sound" : "Disable sound"}
        >
          {isMuted ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          )}
        </button>
      )}

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
} 