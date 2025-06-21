'use client'

import { motion } from 'framer-motion'
import { Moon, Plus } from 'lucide-react'
import { Button } from './ui/Button'
import Link from 'next/link'

export function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center justify-center py-16 px-6 text-center"
    >
      {/* Animated illustration */}
      <motion.div
        animate={{ 
          y: [0, -10, 0],
          rotate: [0, 2, -2, 0]
        }}
        transition={{ 
          duration: 4, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className="mb-8"
      >
        <div className="relative">
          {/* Moon background */}
          <div className="w-24 h-24 bg-gradient-to-br from-slate-600 to-slate-800 rounded-full flex items-center justify-center shadow-lg">
            <Moon className="w-12 h-12 text-slate-400" />
          </div>
          
          {/* Floating Z's */}
          <motion.div
            animate={{ 
              opacity: [0, 1, 0],
              y: [-10, -20, -30],
              x: [0, 5, -5]
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity, 
              delay: 1,
              ease: "easeOut" 
            }}
            className="absolute -top-2 -right-2 text-2xl text-slate-500"
          >
            z
          </motion.div>
          
          <motion.div
            animate={{ 
              opacity: [0, 1, 0],
              y: [-10, -20, -30],
              x: [0, -5, 5]
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity, 
              delay: 2,
              ease: "easeOut" 
            }}
            className="absolute -top-4 -left-2 text-xl text-slate-500"
          >
            z
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="space-y-4"
      >
        <h3 className="text-2xl font-bold text-white">
          Your Sentinel is asleep 😴
        </h3>
        <p className="text-slate-400 max-w-md">
          No active trials to monitor. Add your first trial and let your guardian watch over it.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="mt-8"
      >
        <Link href="/dashboard/add-trial">
          <Button className="bg-gradient-to-r from-fantasy-crimson to-fantasy-molten hover:from-fantasy-molten hover:to-fantasy-crimson text-white font-semibold px-6 py-3 transition-all duration-300 shadow-lg hover:shadow-fantasy-crimson/25">
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Trial
          </Button>
        </Link>
      </motion.div>
    </motion.div>
  )
} 