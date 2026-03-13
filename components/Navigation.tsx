'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, X, Search } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // First try to get user from Supabase
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
        
        if (user) {
          const { data } = await supabase
            .from('admin_users')
            .select('id')
            .eq('user_id', user.id)
            .single()
          setIsAdmin(!!data)
          // Store admin status in localStorage as fallback
          localStorage.setItem('stm_admin_status', !!data ? 'true' : 'false')
        }
      } catch (error) {
        // Fallback to localStorage if Supabase fails
        const adminStatus = localStorage.getItem('stm_admin_status')
        if (adminStatus === 'true') {
          setIsAdmin(true)
          setUser({ email: 'admin@stmevents.com' }) // Minimal user data
        }
      }
    }

    checkAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          setUser(session.user)
          checkAuth()
        } else {
          setUser(null)
          setIsAdmin(false)
          localStorage.removeItem('stm_admin_status')
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  return (
    <nav className="fixed top-0 w-full z-50 bg-black border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="text-xl font-bold uppercase tracking-tight hover:text-gray-300 transition-colors">
            STM EVENTS
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/events" className="text-sm uppercase tracking-wide hover:text-gray-300 transition-colors">
              Events
            </Link>
            <Link href="/gallery" className="text-sm uppercase tracking-wide hover:text-gray-300 transition-colors">
              Video
            </Link>
            <Link href="/gallery" className="text-sm uppercase tracking-wide hover:text-gray-300 transition-colors">
              Audio
            </Link>
            <Link href="/services" className="text-sm uppercase tracking-wide hover:text-gray-300 transition-colors">
              Services
            </Link>
            <Link href="/equipment" className="text-sm uppercase tracking-wide hover:text-gray-300 transition-colors">
              Equipment
            </Link>
            <Link href="/about" className="text-sm uppercase tracking-wide hover:text-gray-300 transition-colors">
              Editorial
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <button className="text-white hover:text-gray-300 transition-colors">
              <Search size={18} />
            </button>
            {isAdmin ? (
              <Link href="/admin/dashboard" className="text-sm uppercase tracking-wide text-purple-400 hover:text-purple-300 transition-colors">
                Admin Console
              </Link>
            ) : (
              <Link href="/admin/login" className="text-sm uppercase tracking-wide hover:text-gray-300 transition-colors">
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white hover:text-gray-300 transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 border-t border-white/10 mt-2 pt-2">
            <Link href="/events" className="block text-sm uppercase tracking-wide hover:text-gray-300 transition-colors py-2">
              Events
            </Link>
            <Link href="/gallery" className="block text-sm uppercase tracking-wide hover:text-gray-300 transition-colors py-2">
              Video
            </Link>
            <Link href="/services" className="block text-sm uppercase tracking-wide hover:text-gray-300 transition-colors py-2">
              Services
            </Link>
            <Link href="/equipment" className="block text-sm uppercase tracking-wide hover:text-gray-300 transition-colors py-2">
              Equipment
            </Link>
            <Link href="/contact" className="block text-sm uppercase tracking-wide hover:text-gray-300 transition-colors py-2">
              Contact
            </Link>
            {isAdmin ? (
              <Link href="/admin/dashboard" className="block text-sm uppercase tracking-wide text-purple-400 hover:text-purple-300 transition-colors py-2 border-t border-white/10 mt-2 pt-2">
                Admin Console
              </Link>
            ) : (
              <Link href="/admin/login" className="block text-sm uppercase tracking-wide hover:text-gray-300 transition-colors py-2 border-t border-white/10 mt-2 pt-2">
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
