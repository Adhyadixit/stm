'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Calendar, ImageIcon, Wrench, Music, MessageSquare, Loader2, TrendingUp, Users, Activity } from 'lucide-react'

export default function AdminDashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [counts, setCounts] = useState({ events: 0, gallery: 0, equipment: 0, djs: 0, contacts: 0 })

  useEffect(() => {
    async function checkAuthAndLoad() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/admin/login')
        return
      }

      const { data: adminData } = await supabase
        .from('admin_users')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (!adminData) {
        router.push('/admin/login')
        return
      }

      const [eventsRes, galleryRes, equipmentRes, djsRes, contactsRes] = await Promise.all([
        supabase.from('events').select('id', { count: 'exact', head: true }),
        supabase.from('gallery').select('id', { count: 'exact', head: true }),
        supabase.from('equipment').select('id', { count: 'exact', head: true }),
        supabase.from('resident_djs').select('id', { count: 'exact', head: true }),
        supabase.from('contact_submissions').select('id', { count: 'exact', head: true }),
      ])

      setCounts({
        events: eventsRes.count || 0,
        gallery: galleryRes.count || 0,
        equipment: equipmentRes.count || 0,
        djs: djsRes.count || 0,
        contacts: contactsRes.count || 0,
      })
      setLoading(false)
    }
    checkAuthAndLoad()
  }, [router])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-purple-600" size={48} />
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 mt-1">Welcome back! Here's what's happening with your platform.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <div className="glass-effect p-6 rounded-xl border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center border border-purple-600/30">
              <Calendar className="text-purple-400" size={20} />
            </div>
            <TrendingUp className="text-green-400" size={16} />
          </div>
          <p className="text-2xl font-bold text-white">{counts.events}</p>
          <p className="text-sm text-gray-400">Total Events</p>
        </div>

        <div className="glass-effect p-6 rounded-xl border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center border border-blue-600/30">
              <ImageIcon className="text-blue-400" size={20} />
            </div>
            <Activity className="text-blue-400" size={16} />
          </div>
          <p className="text-2xl font-bold text-white">{counts.gallery}</p>
          <p className="text-sm text-gray-400">Gallery Items</p>
        </div>

        <div className="glass-effect p-6 rounded-xl border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-green-600/20 rounded-lg flex items-center justify-center border border-green-600/30">
              <Wrench className="text-green-400" size={20} />
            </div>
            <Activity className="text-green-400" size={16} />
          </div>
          <p className="text-2xl font-bold text-white">{counts.equipment}</p>
          <p className="text-sm text-gray-400">Equipment</p>
        </div>

        <div className="glass-effect p-6 rounded-xl border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-orange-600/20 rounded-lg flex items-center justify-center border border-orange-600/30">
              <Music className="text-orange-400" size={20} />
            </div>
            <Users className="text-orange-400" size={16} />
          </div>
          <p className="text-2xl font-bold text-white">{counts.djs}</p>
          <p className="text-sm text-gray-400">Resident DJs</p>
        </div>

        <div className="glass-effect p-6 rounded-xl border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-red-600/20 rounded-lg flex items-center justify-center border border-red-600/30">
              <MessageSquare className="text-red-400" size={20} />
            </div>
            <Activity className="text-red-400" size={16} />
          </div>
          <p className="text-2xl font-bold text-white">{counts.contacts}</p>
          <p className="text-sm text-gray-400">Messages</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link 
            href="/admin/events/new" 
            className="bg-gradient-to-br from-purple-600 to-purple-700 p-6 rounded-xl text-white hover:shadow-lg hover-lift transition-all group"
          >
            <Calendar className="mb-3 group-hover:scale-110 transition-transform" size={32} />
            <h3 className="text-lg font-semibold mb-1">Create Event</h3>
            <p className="text-purple-100 text-sm">Add a new event to the calendar</p>
          </Link>

          <Link 
            href="/admin/equipment/new" 
            className="bg-gradient-to-br from-green-600 to-green-700 p-6 rounded-xl text-white hover:shadow-lg hover-lift transition-all group"
          >
            <Wrench className="mb-3 group-hover:scale-110 transition-transform" size={32} />
            <h3 className="text-lg font-semibold mb-1">Add Equipment</h3>
            <p className="text-green-100 text-sm">List new equipment for rental</p>
          </Link>

          <Link 
            href="/admin/gallery/new" 
            className="bg-gradient-to-br from-blue-600 to-blue-700 p-6 rounded-xl text-white hover:shadow-lg hover-lift transition-all group"
          >
            <ImageIcon className="mb-3 group-hover:scale-110 transition-transform" size={32} />
            <h3 className="text-lg font-semibold mb-1">Upload Media</h3>
            <p className="text-blue-100 text-sm">Add photos or videos to gallery</p>
          </Link>
        </div>
      </div>

      {/* Management Sections */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Management</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/admin/events" className="glass-effect p-6 rounded-xl border border-white/10 hover:border-purple-600/50 hover-lift transition-all group">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center flex-shrink-0 border border-purple-600/30">
                <Calendar className="text-purple-400" size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-purple-400 transition-colors">
                  Events
                </h3>
                <p className="text-sm text-gray-400">Manage all events and schedules</p>
              </div>
            </div>
          </Link>

          <Link href="/admin/equipment" className="glass-effect p-6 rounded-xl border border-white/10 hover:border-green-600/50 hover-lift transition-all group">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center flex-shrink-0 border border-green-600/30">
                <Wrench className="text-green-400" size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-green-400 transition-colors">
                  Equipment
                </h3>
                <p className="text-sm text-gray-400">Manage equipment inventory</p>
              </div>
            </div>
          </Link>

          <Link href="/admin/gallery" className="glass-effect p-6 rounded-xl border border-white/10 hover:border-blue-600/50 hover-lift transition-all group">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center flex-shrink-0 border border-blue-600/30">
                <ImageIcon className="text-blue-400" size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-blue-400 transition-colors">
                  Gallery
                </h3>
                <p className="text-sm text-gray-400">Manage media and content</p>
              </div>
            </div>
          </Link>

          <Link href="/admin/djs" className="glass-effect p-6 rounded-xl border border-white/10 hover:border-orange-600/50 hover-lift transition-all group">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-orange-600/20 rounded-lg flex items-center justify-center flex-shrink-0 border border-orange-600/30">
                <Music className="text-orange-400" size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-orange-400 transition-colors">
                  Resident DJs
                </h3>
                <p className="text-sm text-gray-400">Manage DJ profiles</p>
              </div>
            </div>
          </Link>

          <Link href="/admin/contacts" className="glass-effect p-6 rounded-xl border border-white/10 hover:border-red-600/50 hover-lift transition-all group">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-red-600/20 rounded-lg flex items-center justify-center flex-shrink-0 border border-red-600/30">
                <MessageSquare className="text-red-400" size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-red-400 transition-colors">
                  Contact Submissions
                </h3>
                <p className="text-sm text-gray-400">View and respond to messages</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
