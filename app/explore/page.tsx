import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { ExploreClient } from '@/components/ExploreClient'
import { fetchCuratedTrials, getTrialCategories } from '@/lib/fetchTrials'
import FantasyBackgroundWrapper from '@/components/FantasyBackgroundWrapper'
import { Logo } from '@/components/ui/Logo'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Sparkles, DollarSign, Bell, LayoutGrid } from 'lucide-react'

export default async function ExplorePage() {
  const supabase = createServerComponentClient({ cookies })
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const [trials, categories] = await Promise.all([
    fetchCuratedTrials(),
    getTrialCategories()
  ])

  return (
    <FantasyBackgroundWrapper showEmbers={true} showEyeGlow={true}>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-red-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>

        {/* Content */}
        <div className="relative z-10">
          {/* Header */}
          <div className="container mx-auto px-4 py-4 lg:py-6">
            {/* Top Row - Logo and Buttons */}
            {!user ? (
              <div className="flex flex-col sm:flex-row items-center justify-between mb-4 lg:mb-6 gap-4">
                <div className="flex items-center">
                  <Logo size="xl" containerSize="xl" />
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs mx-auto sm:mx-0 sm:w-auto justify-center sm:justify-end mt-4 lg:mt-0">
                  <Link href="/signup" className="w-full sm:w-auto">
                    <Button className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold px-6 py-3 text-base rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center h-12">
                      <Sparkles className="w-5 h-5 mr-2" />
                      <span className="whitespace-nowrap">Get Started Free</span>
                    </Button>
                  </Link>
                  <Link href="/login" className="w-full sm:w-auto">
                    <Button variant="secondary" className="w-full sm:w-auto border-slate-600/50 text-slate-300 hover:bg-slate-700/50 px-6 py-3 text-base rounded-xl flex items-center justify-center h-12">
                      <span className="whitespace-nowrap">Sign In</span>
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-center justify-between mb-4 lg:mb-6 gap-4">
                <div className="flex items-center">
                  <Logo size="xl" containerSize="xl" />
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs mx-auto sm:mx-0 sm:w-auto justify-center sm:justify-end mt-4 lg:mt-0">
                  <Link href="/dashboard" className="w-full sm:w-auto">
                    <Button className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold px-6 py-3 text-base rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center h-12">
                      Go to Dashboard
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            {/* Hero Section for anonymous users */}
            {!user && (
              <>
                <div className="w-full mb-6">
                  <div className="w-full bg-gradient-to-br from-slate-800/60 to-slate-700/60 border border-slate-600/30 rounded-2xl shadow-xl p-6 md:p-10 px-4 md:px-8 lg:px-16 backdrop-blur-sm">
                    <h1 className="text-3xl md:text-5xl font-bold text-white text-center mb-4">
                      Welcome to <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">Free Trial Sentinel</span>
                    </h1>
                    <p className="text-lg md:text-2xl text-slate-200 text-center mb-2">
                      Track, manage, and cancel free trials - before they become expensive mistakes.
                    </p>
                    <div className="flex flex-col md:flex-row md:items-center gap-2 mt-2 justify-center text-center">
                      <span className="flex items-center gap-2 text-orange-300 text-base md:text-lg justify-center">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><circle cx="10" cy="10" r="10" /></svg> No more forgotten subscriptions
                      </span>
                      <span className="hidden md:inline text-orange-300 mx-2">|</span>
                      <span className="flex items-center gap-2 text-orange-300 text-base md:text-lg justify-center">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><circle cx="10" cy="10" r="10" /></svg> No more wasted money
                      </span>
                    </div>
                  </div>
                </div>

                <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-y-6 md:gap-y-0 md:gap-x-6 mb-10">
                  <div className="bg-slate-800/70 border border-orange-500/20 rounded-2xl p-7 flex flex-col items-center text-center shadow-lg hover:shadow-xl hover:scale-[1.03] transition-all duration-200 min-h-[240px]">
                    <div className="w-14 h-14 flex items-center justify-center bg-orange-500/20 rounded-xl mb-5">
                      <DollarSign className="w-8 h-8 text-orange-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">Save Money Automatically</h3>
                    <p className="text-slate-300 text-base leading-relaxed">Avoid paying for subscriptions you forgot to cancel.</p>
                  </div>
                  <div className="bg-slate-800/70 border border-red-500/20 rounded-2xl p-7 flex flex-col items-center text-center shadow-lg hover:shadow-xl hover:scale-[1.03] transition-all duration-200 min-h-[240px]">
                    <div className="w-14 h-14 flex items-center justify-center bg-red-500/20 rounded-xl mb-5">
                      <Bell className="w-8 h-8 text-red-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">Get Reminded Before You Pay</h3>
                    <p className="text-slate-300 text-base leading-relaxed">Smart alerts help you cancel on time - before it's too late.</p>
                  </div>
                  <div className="bg-slate-800/70 border border-yellow-400/20 rounded-2xl p-7 flex flex-col items-center text-center shadow-lg hover:shadow-xl hover:scale-[1.03] transition-all duration-200 min-h-[240px]">
                    <div className="w-14 h-14 flex items-center justify-center bg-yellow-400/20 rounded-xl mb-5">
                      <LayoutGrid className="w-8 h-8 text-yellow-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">Track All Your Free Trials in One Place</h3>
                    <p className="text-slate-300 text-base leading-relaxed">From Netflix to Notion, stay organized with a central dashboard.</p>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Main Content - Client Component for Filtering */}
          <ExploreClient 
            initialTrials={trials} 
            categories={categories} 
            user={user}
          />
        </div>
      </div>
    </FantasyBackgroundWrapper>
  )
} 