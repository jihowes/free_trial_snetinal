// Utility functions for timezone-aware date calculations

/**
 * Calculate days left until trial expiry using local timezone
 * This ensures consistent date calculations regardless of system timezone
 */
export const calculateDaysLeft = (endDate: string): number => {
  const now = new Date()
  const end = new Date(endDate)
  
  // Get the date parts in local timezone (strip time)
  const nowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const endDateOnly = new Date(end.getFullYear(), end.getMonth(), end.getDate())
  
  // Calculate difference in days
  const timeDiff = endDateOnly.getTime() - nowDate.getTime()
  const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24))
  
  return daysDiff
}

/**
 * Check if a trial is expired using local timezone
 */
export const isTrialExpired = (endDate: string): boolean => {
  const now = new Date()
  const end = new Date(endDate)
  return end < now
}

/**
 * Get user's timezone for display purposes
 */
export const getUserTimezone = (): string => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone
}

/**
 * Format date for display with timezone info
 */
export const formatDateWithTimezone = (date: Date): string => {
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString()} (${getUserTimezone()})`
}

/**
 * Create end-of-day timestamp for a given date in local timezone
 */
export const createEndOfDay = (dateString: string): string => {
  const date = new Date(dateString)
  date.setHours(23, 59, 59, 999)
  return date.toISOString()
} 