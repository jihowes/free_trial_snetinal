'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Filter, X } from 'lucide-react'
import { Button } from './ui/Button'
import { Badge } from './ui/Badge'

interface ExploreFiltersProps {
  categories: string[]
}

export function ExploreFilters({ categories }: ExploreFiltersProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [showFilters, setShowFilters] = useState(false)

  const clearFilters = () => {
    setSelectedCategory('')
  }

  const hasActiveFilters = selectedCategory !== ''

  return (
    <div className="w-full">
      {/* Filter Toggle */}
      <div className="flex items-center justify-between mb-4">
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
                1
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

        {hasActiveFilters && (
          <div className="text-sm text-slate-400">
            Showing {selectedCategory} trials
          </div>
        )}
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-slate-800/20 border border-slate-600/30 rounded-lg p-4 mb-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Filter Trials</h3>
          
          {/* Category Filter */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Category
            </label>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === '' ? 'primary' : 'secondary'}
                onClick={() => setSelectedCategory('')}
                className={selectedCategory === '' 
                  ? 'bg-orange-500 hover:bg-orange-600 text-white' 
                  : 'border-slate-600/30 text-slate-300 hover:bg-slate-500/20'
                }
              >
                All Categories
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'primary' : 'secondary'}
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category 
                    ? 'bg-orange-500 hover:bg-orange-600 text-white' 
                    : 'border-slate-600/30 text-slate-300 hover:bg-slate-500/20'
                  }
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Additional filters can be added here */}
          <div className="text-sm text-slate-400">
            More filters coming soon: price range, trial length, and region availability.
          </div>
        </motion.div>
      )}
    </div>
  )
} 