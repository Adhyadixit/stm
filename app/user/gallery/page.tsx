'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Music, Play, Image as ImageIcon, Download } from 'lucide-react'

export default function UserGallery() {
  const [user, setUser] = useState<any>(null)
  const [gallery, setGallery] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'video' | 'audio'>('all')

  useEffect(() => {
    const getUserAndGallery = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      
      // Fetch gallery items
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (data) {
        setGallery(data)
      }
      setLoading(false)
    }
    
    getUserAndGallery()
  }, [])

  const filteredGallery = gallery.filter(item => {
    if (filter === 'all') return true
    return item.type === filter
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-white">Loading gallery...</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">My Gallery</h1>
        <p className="text-gray-400">Your saved audio and video content</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-4 border-b border-white/10">
        {[
          { key: 'all', label: 'All', icon: ImageIcon },
          { key: 'video', label: 'Video', icon: Play },
          { key: 'audio', label: 'Audio', icon: Music }
        ].map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as any)}
              className={`
                flex items-center gap-2 px-4 py-3 border-b-2 transition-colors
                ${filter === tab.key 
                  ? 'border-purple-400 text-purple-400' 
                  : 'border-transparent text-gray-400 hover:text-white'
                }
              `}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {filteredGallery.length === 0 ? (
        <div className="text-center py-12">
          <Music size={48} className="text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Gallery Items</h3>
          <p className="text-gray-400 mb-6">
            {filter === 'all' 
              ? "You haven't saved any gallery items yet." 
              : `No ${filter} items found.`
            }
          </p>
          <a
            href="/gallery"
            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
          >
            Browse Gallery
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGallery.map((item) => (
            <div key={item.id} className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden hover:border-purple-500/30 transition-colors">
              <div className="aspect-video bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                {item.type === 'video' ? (
                  <Play size={48} className="text-white/50" />
                ) : (
                  <Music size={48} className="text-white/50" />
                )}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{item.description}</p>
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    (item.type || 'unknown') === 'video' 
                      ? 'bg-blue-500/20 text-blue-400' 
                      : 'bg-green-500/20 text-green-400'
                  }`}>
                    {(item.type || 'unknown').toUpperCase()}
                  </span>
                  <button className="p-2 text-gray-400 hover:text-white transition-colors">
                    <Download size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
