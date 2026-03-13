'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Calendar, Music, Users, TrendingUp } from 'lucide-react'

export default function UserDashboard() {
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState({
    events: 0,
    gallery: 0,
    bookings: 0
  })

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [])

  const statCards = [
    {
      title: 'My Events',
      value: stats.events,
      icon: Calendar,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20'
    },
    {
      title: 'Gallery Items',
      value: stats.gallery,
      icon: Music,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20'
    },
    {
      title: 'Bookings',
      value: stats.bookings,
      icon: Users,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20'
    }
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">User Dashboard</h1>
        <p className="text-gray-400">Welcome back, {user?.email}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon
          return (
            <div
              key={index}
              className={`p-6 rounded-xl border ${card.borderColor} ${card.bgColor} backdrop-blur-sm`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">{card.title}</p>
                  <p className="text-3xl font-bold text-white">{card.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${card.bgColor}`}>
                  <Icon size={24} className={card.color} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Recent Activity */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
        <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <Calendar size={20} className="text-purple-400" />
            </div>
            <div className="flex-1">
              <p className="text-white font-medium">No recent events</p>
              <p className="text-gray-400 text-sm">Start by exploring our events</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
        <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="/events"
            className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg hover:bg-purple-500/20 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <Calendar size={20} className="text-purple-400" />
              <span className="text-white group-hover:text-purple-300">Browse Events</span>
            </div>
          </a>
          <a
            href="/gallery"
            className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg hover:bg-blue-500/20 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <Music size={20} className="text-blue-400" />
              <span className="text-white group-hover:text-blue-300">View Gallery</span>
            </div>
          </a>
        </div>
      </div>
    </div>
  )
}
