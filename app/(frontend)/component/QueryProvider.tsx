// src/components/providers/QueryProvider.tsx
'use client' // <--- WAJIB ADA INI

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState, ReactNode } from 'react'

/**
 * QueryProvider Component
 * 
 * Wraps the application with TanStack Query Client Provider.
 * Configures default query behavior (e.g., refetchOnWindowFocus: false).
 * Ensures the QueryClient is initialized only once per session.
 */
export default function QueryProvider({ children }: Readonly<{ children: ReactNode }>) {
    // useState memastikan QueryClient hanya dibuat sekali saat user buka web
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                // Agar data tidak refresh otomatis saat user pindah tab browser
                refetchOnWindowFocus: false,
            },
        },
    }))

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )
}