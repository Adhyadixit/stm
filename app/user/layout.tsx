'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { 
  Home, 
  Calendar, 
  Music, 
  Settings, 
  LogOut, 
  User,
  ChevronRight,
  Menu,
  X
} from 'lucide-react'
import Link from 'next/link'
import { ReactNode } from 'react'

export default function UserLayout({
  children,
}: {
  children: ReactNode
}) {
  const [user, setUser] = useState<any>(null)
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      if (!user) {
        router.push('/login')
      }
    }
    getUser()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    localStorage.removeItem('stm_admin_status')
    router.push('/login')
  }

  const menuItems = [
    { href: '/user/dashboard', label: 'Dashboard', icon: Home },
    { href: '/user/events', label: 'My Events', icon: Calendar },
    { href: '/user/gallery', label: 'My Gallery', icon: Music },
    { href: '/user/profile', label: 'Profile', icon: User },
    { href: '/user/settings', label: 'Settings', icon: Settings },
  ]

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg bg-white/10 backdrop-blur-md border border-white/20"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`
          fixed lg:static inset-y-0 left-0 z-40 w-64 
          bg-black border-r border-white/10 
          transform transition-transform duration-200 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="p-6">
            <Link href="/user/dashboard" className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">STM</span>
              </div>
              <div>
                <h1 className="text-white font-bold">User Panel</h1>
                <p className="text-gray-400 text-xs">STM Events</p>
              </div>
            </Link>

            <nav className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-white/10 rounded-lg transition-colors group"
                  >
                    <Icon size={20} className="group-hover:text-purple-400" />
                    <span className="group-hover:text-white">{item.label}</span>
                    <ChevronRight size={16} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                )
              })}
            </nav>

            <div className="mt-8 pt-8 border-t border-white/10">
              <div className="mb-4">
                <p className="text-gray-400 text-sm">Logged in as</p>
                <p className="text-white text-sm font-medium truncate">{user.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-900/20 rounded-lg transition-colors border border-red-900/30"
              >
                <LogOut size={20} />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 lg:ml-0">
          <div className="p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}
