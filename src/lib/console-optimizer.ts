/**
 * Console optimization utilities
 * Helps manage console output and suppress unnecessary warnings
 */

// Known warnings that can be safely suppressed in development
const SUPPRESSIBLE_WARNINGS = [
  'was preloaded using link preload but not used within a few seconds',
  'ReaderArticleFinder',
  'discuz_cache',
  'skip',
  'api ready',
  'injject',
  'Fast Refresh',
  'rebuilding'
]

// Store original console methods
const originalConsole = {
  log: console.log,
  warn: console.warn,
  error: console.error,
  debug: console.debug,
  info: console.info
}

/**
 * Check if a message should be suppressed
 */
function shouldSuppressMessage(message: string): boolean {
  if (process.env.NODE_ENV === 'production') {
    return false // Don't suppress in production
  }

  return SUPPRESSIBLE_WARNINGS.some(warning => 
    message.toLowerCase().includes(warning.toLowerCase())
  )
}

/**
 * Enhanced console.warn that filters out known non-critical warnings
 */
function enhancedWarn(...args: any[]) {
  const message = args.join(' ')
  
  if (shouldSuppressMessage(message)) {
    // Optionally log to debug instead
    if (process.env.NEXT_PUBLIC_DEBUG_CONSOLE === 'true') {
      originalConsole.debug('[SUPPRESSED WARNING]', ...args)
    }
    return
  }
  
  originalConsole.warn(...args)
}

/**
 * Enhanced console.error that provides better error context
 */
function enhancedError(...args: any[]) {
  const message = args.join(' ')
  
  // Don't suppress errors, but provide better context
  if (process.env.NODE_ENV === 'development') {
    originalConsole.error('[DEV ERROR]', ...args)
  } else {
    originalConsole.error(...args)
  }
}

/**
 * Initialize console optimization
 */
export function initializeConsoleOptimization() {
  if (typeof window === 'undefined') return

  // Only optimize in development
  if (process.env.NODE_ENV === 'development') {
    console.warn = enhancedWarn
    console.error = enhancedError
    
    // Add a flag to identify optimized console
    ;(window as any).__CONSOLE_OPTIMIZED__ = true
    
    console.debug('Console optimization initialized')
  }
}

/**
 * Restore original console methods
 */
export function restoreConsole() {
  if (typeof window === 'undefined') return
  
  console.log = originalConsole.log
  console.warn = originalConsole.warn
  console.error = originalConsole.error
  console.debug = originalConsole.debug
  console.info = originalConsole.info
  
  delete (window as any).__CONSOLE_OPTIMIZED__
}

/**
 * Log performance metrics in a clean format
 */
export function logPerformanceMetric(name: string, value: number, unit: string = 'ms') {
  if (process.env.NODE_ENV === 'development') {
    console.log(`🚀 ${name}: ${value.toFixed(2)}${unit}`)
  }
}

/**
 * Log optimization actions
 */
export function logOptimization(action: string, details?: string) {
  if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_DEBUG_OPTIMIZATION === 'true') {
    console.log(`⚡ ${action}${details ? `: ${details}` : ''}`)
  }
}

/**
 * Clean error reporting for production
 */
export function reportError(error: Error, context?: string) {
  if (process.env.NODE_ENV === 'production') {
    // In production, send to error reporting service
    // For now, just log cleanly
    console.error('Application Error:', {
      message: error.message,
      context,
      timestamp: new Date().toISOString()
    })
  } else {
    // In development, show full error
    console.error('Development Error:', error, context ? { context } : '')
  }
}
