"use client";

import { useState, useEffect, ReactNode } from "react";

interface HydrationSafeProps {
  children: ReactNode;
  fallback?: ReactNode;
  className?: string;
}

/**
 * HydrationSafe component prevents hydration mismatches by only rendering
 * children after the component has mounted on the client side.
 * 
 * This is useful for components that:
 * - Use localStorage, sessionStorage, or other browser APIs
 * - Render different content based on client-side state
 * - Use theme providers or other context that might differ between server and client
 * 
 * @param children - The content to render after hydration
 * @param fallback - Optional fallback content to show during SSR and before hydration
 * @param className - Optional CSS classes to apply to the wrapper
 */
export function HydrationSafe({ children, fallback = null, className }: HydrationSafeProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return fallback ? <div className={className}>{fallback}</div> : null;
  }

  return <div className={className}>{children}</div>;
}

/**
 * Hook to check if component has mounted (useful for preventing hydration mismatches)
 */
export function useMounted() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}

/**
 * Higher-order component that wraps a component to make it hydration-safe
 */
export function withHydrationSafe<T extends object>(
  Component: React.ComponentType<T>,
  fallback?: ReactNode
) {
  const HydrationSafeComponent = (props: T) => {
    const mounted = useMounted();

    if (!mounted) {
      return fallback || null;
    }

    return <Component {...props} />;
  };

  HydrationSafeComponent.displayName = `HydrationSafe(${Component.displayName || Component.name})`;

  return HydrationSafeComponent;
}
