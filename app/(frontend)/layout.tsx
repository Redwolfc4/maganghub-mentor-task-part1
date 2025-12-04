import React from 'react'
import './styles.css'
import QueryProvider from './component/QueryProvider'

export const metadata = {
  description: 'this is for product management store website',
  title: 'Data Product Management',
}

/**
 * Root Layout
 * 
 * The top-level layout for the application.
 * Wraps the application in a QueryProvider for React Query support.
 */
export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <body>
        <QueryProvider>
          <main>{children}</main>
        </QueryProvider>
      </body>
    </html>
  )
}
