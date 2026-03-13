'use client'

import { usePathname } from 'next/navigation'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { ReactNode } from 'react'

export default function LayoutWrapper({
  children,
}: {
  children: ReactNode
}) {
  const pathname = usePathname()
  
  // Check if we're in an admin route (excluding login page)
  const isAdminRoute = pathname?.startsWith('/admin/') && pathname !== '/admin/login'
  
  // Check if we're in a user route (excluding login page)
  const isUserRoute = pathname?.startsWith('/user/') && pathname !== '/user/login'
  
  if (isAdminRoute || isUserRoute) {
    // For admin and user routes, render children without header/footer
    return <>{children}</>
  }
  
  // For regular routes, render children with header/footer
  return (
    <>
      <Navigation />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </>
  )
}
