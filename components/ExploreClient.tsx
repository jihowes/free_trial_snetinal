'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExploreTrialCard } from '@/components/ExploreTrialCard'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import Link from 'next/link'
import { 
  Search, 
  Filter, 
  X, 
  Sparkles,
  ChevronDown
} from 'lucide-react'

interface Trial {
  id: string
  service_name: string
  trial_length_days: number
  category: string
  geo_availability: string[]
  affiliate_link: string
  sentinel_score: number
  description: string
  monthly_price: number
}

interface ExploreClientProps {
  initialTrials: Trial[]
  categories: string[]
  user: any
}

export function ExploreClient({ initialTrials, categories, user }: ExploreClientProps) {
  const [trials] = useState<Trial[]>(initialTrials)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [sortBy, setSortBy] = useState<'score' | 'name'>('score')
  const [showFilters, setShowFilters] = useState(false)
  const [showSortDropdown, setShowSortDropdown] = useState(false)

  // Filter and sort trials
  const filteredTrials = useMemo(() => {
    let filtered = trials

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(trial =>
        trial.service_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trial.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trial.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(trial => trial.category === selectedCategory)
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'score':
          return b.sentinel_score - a.sentinel_score
        case 'name':
          return a.service_name.localeCompare(b.service_name)
        default:
          return 0
      }
    })

    return filtered
  }, [trials, searchQuery, selectedCategory, sortBy])

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedCategory('')
  }

  const hasActiveFilters = searchQuery || selectedCategory

  const sortOptions = [
    { value: 'score', label: 'Sentinel Score' },
    { value: 'name', label: 'Name' }
  ]

  const getSortLabel = (value: string) => {
    return sortOptions.find(option => option.value === value)?.label || 'Sentinel Score'
  }

  return (
    <div className="container mx-auto px-4 pb-8 lg:pb-12">
      {/* Header Section */}
      <div className="text-center mb-8">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-full px-6 py-3 mb-4">
            <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
            <span className="text-orange-400 font-semibold text-sm uppercase tracking-wide">Curated Collection</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight">
            Explore{' '}
            <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
              Curated Trials
            </span>
          </h2>
          <p className="text-lg lg:text-xl text-slate-300 leading-relaxed max-w-3xl mx-auto">
            Hand-picked free trials from the best services. Each trial is rated with our{' '}
            <span className="text-orange-400 font-semibold">Sentinel Score</span> to help you choose wisely.
          </p>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="sticky top-0 z-20 bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50 -mx-4 px-4 py-4 mb-6">
        <div className="max-w-7xl mx-auto">
          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search trials by name, description, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-800/50 border-slate-600/30 text-white placeholder-slate-400 focus:border-slate-500/50 focus:ring-slate-500/20"
            />
          </div>

          {/* Filters and Controls */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Filter Controls */}
            <div className="flex items-center gap-3">
              <Button
                variant="secondary"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 border-slate-600/30 text-slate-300 hover:bg-slate-500/20"
              >
                <Filter className="w-4 h-4" />
                Filters
                {hasActiveFilters && (
                  <Badge className="ml-1 bg-orange-500/20 text-orange-300 border-orange-500/30 text-xs">
                    {searchQuery ? 1 : 0 + (selectedCategory ? 1 : 0)}
                  </Badge>
                )}
              </Button>
              
              {hasActiveFilters && (
                <Button
                  variant="secondary"
                  onClick={clearFilters}
                  className="flex items-center gap-2 border-slate-600/30 text-slate-400 hover:text-slate-300 hover:bg-slate-500/20"
                >
                  <X className="w-4 h-4" />
                  Clear
                </Button>
              )}
            </div>

            {/* Sort Controls */}
            <div className="flex items-center gap-3">
              {/* Custom Sort Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-400">Sort by:</span>
                <div className="relative">
                  <Button
                    onClick={() => setShowSortDropdown(!showSortDropdown)}
                    className="bg-slate-800/80 border border-slate-600/50 text-white text-sm rounded-lg px-3 py-2 hover:bg-slate-700/80 transition-colors flex items-center gap-2"
                  >
                    {getSortLabel(sortBy)}
                    <ChevronDown className={`w-4 h-4 transition-transform ${showSortDropdown ? 'rotate-180' : ''}`} />
                  </Button>
                  
                  <AnimatePresence>
                    {showSortDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 mt-1 w-full bg-slate-800 border border-slate-600/50 rounded-lg shadow-lg z-50"
                      >
                        {sortOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => {
                              setSortBy(option.value as any)
                              setShowSortDropdown(false)
                            }}
                            className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                              sortBy === option.value
                                ? 'bg-orange-500 text-white'
                                : 'text-slate-300 hover:bg-slate-700'
                            } first:rounded-t-lg last:rounded-b-lg`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>

          {/* Filter Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 pt-4 border-t border-slate-700/30"
              >
                <h3 className="text-lg font-semibold text-white mb-4">Filter by Category</h3>
                <div className="flex flex-wrap gap-2">
                  <Button
                    onClick={() => setSelectedCategory('')}
                    className={selectedCategory === '' 
                      ? '!bg-orange-500 !text-white hover:!bg-orange-600 !border-orange-500' 
                      : '!bg-slate-800/50 !border-slate-600/30 !text-slate-300 hover:!bg-slate-500/20'
                    }
                  >
                    All Categories
                  </Button>
                  {categories.map((category) => (
                    <Button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={selectedCategory === category 
                        ? '!bg-orange-500 !text-white hover:!bg-orange-600 !border-orange-500' 
                        : '!bg-slate-800/50 !border-slate-600/30 !text-slate-300 hover:!bg-slate-500/20'
                      }
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-slate-400">
          Showing {filteredTrials.length} of {trials.length} trials
          {hasActiveFilters && (
            <span className="ml-2 text-orange-400">
              (filtered)
            </span>
          )}
        </div>
      </div>

      {/* Trials Grid */}
      <AnimatePresence mode="wait">
        {filteredTrials.length > 0 ? (
          <motion.div
            key={`${sortBy}-${filteredTrials.length}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {filteredTrials.map((trial, index) => (
              <motion.div
                key={trial.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <ExploreTrialCard 
                  trial={trial as any} 
                  index={index}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No trials found
            </h3>
            <p className="text-slate-400 mb-4">
              Try adjusting your search or filters.
            </p>
            {hasActiveFilters && (
              <Button
                variant="secondary"
                onClick={clearFilters}
                className="flex items-center gap-2 mx-auto"
              >
                <X className="w-4 h-4" />
                Clear all filters
              </Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* CTA Section for Anonymous Users */}
      {!user && filteredTrials.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12 text-center"
        >
          <div className="bg-gradient-to-r from-orange-900/30 to-red-900/30 p-6 rounded-xl border border-orange-500/20 backdrop-blur-sm">
            <h3 className="text-xl font-bold text-orange-300 mb-3">
              Ready to track your trials?
            </h3>
            <p className="text-orange-200/80 mb-4 max-w-2xl mx-auto">
              Create a free Sentinel account to get smart reminders before your trials expire. 
              Join thousands of users who never miss a deadline.
            </p>
            <Link href="/signup">
              <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold px-6 py-3 text-base rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
                <Sparkles className="w-4 h-4 mr-2" />
                Start Protecting Your Trials
              </Button>
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  )
} 