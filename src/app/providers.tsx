'use client';

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { ErrorBoundary } from "react-error-boundary";

/**
 * Error fallback component for the error boundary
 */
function ErrorFallback({
  error,
  resetErrorBoundary
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-red-600">Something went wrong</h2>
        <p className="text-gray-600 max-w-md">
          {error.message || "An unexpected error occurred. Please try again."}
        </p>
        <button
          onClick={resetErrorBoundary}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

/**
 * Main providers component that wraps the entire application
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, errorInfo) => {
        console.error('Application error:', error, errorInfo);
        // Here you could send error to monitoring service
      }}
      onReset={() => {
        // Optionally clear any error state
        window.location.reload();
      }}
    >
      <SessionProvider
        // Refetch session every 5 minutes
        refetchInterval={5 * 60}
        // Refetch session when window is focused
        refetchOnWindowFocus={true}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          enableColorScheme
          disableTransitionOnChange
          themes={['light', 'dark', 'system']}
          storageKey="nextlaunchpad-theme"
        >
          {children}
          {/* Global toast notifications */}
          <Toaster
            position="top-right"
            richColors
            closeButton
            expand={false}
            duration={4000}
          />
        </ThemeProvider>
      </SessionProvider>
    </ErrorBoundary>
  );
}
