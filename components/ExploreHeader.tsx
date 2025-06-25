'use client'

import { motion } from 'framer-motion'
import { Button } from './ui/Button'
import { User } from '@supabase/supabase-js'
import Link from 'next/link'

interface ExploreHeaderProps {
  user: User | null
}

export function ExploreHeader({ user }: ExploreHeaderProps) {
  return (
    <div className="w-full">
      {/* Main Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-400 via-red-500 to-purple-600 bg-clip-text text-transparent mb-4">
          Explore Free Trials
        </h1>
        <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Discover the best free trials from streaming, music, gaming, and software services. 
          {user ? (
            <span className="block mt-2 text-orange-400">
              Welcome back! Your trials are being tracked in your dashboard.
            </span>
          ) : (
            <span className="block mt-2 text-slate-400">
              Sign up to get reminders before your trials expire.
            </span>
          )}
        </p>
      </motion.div>

      {/* Signup Banner for Anonymous Users */}
      {!user && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-gradient-to-r from-orange-900/20 to-red-900/20 p-6 text-center rounded-xl shadow-lg border border-orange-500/20 mb-8"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-left">
              <h3 className="text-lg font-semibold text-orange-300 mb-1">
                Never Miss a Trial Expiry Again
              </h3>
              <p className="text-orange-200/80 text-sm">
                Get smart reminders and track all your free trials in one place
              </p>
            </div>
            <div className="flex gap-3">
              <Link href="/signup">
                <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium px-6 py-2 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl">
                  Create Free Account
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  variant="secondary"
                  className="border-orange-500/30 text-orange-300 hover:bg-orange-500/20"
                >
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      )}

      {/* Welcome Message for Authenticated Users */}
      {user && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 p-6 text-center rounded-xl shadow-lg border border-green-500/20 mb-8"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-left">
              <h3 className="text-lg font-semibold text-green-300 mb-1">
                Welcome back, {user.email?.split('@')[0]}!
              </h3>
              <p className="text-green-200/80 text-sm">
                Your trials are being tracked. Add new ones from below or manage existing ones in your dashboard.
              </p>
            </div>
            <Link href="/dashboard">
              <Button
                variant="secondary"
                className="border-green-500/30 text-green-300 hover:bg-green-500/20"
              >
                View Dashboard
              </Button>
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  )
} 