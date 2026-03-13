'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Plus, ArrowLeft, Loader2, Trash2 } from 'lucide-react'

export default function AdminGallery() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [gallery, setGallery] = useState<any[]>([])

  useEffect(() => { checkAuthAndLoad() }, [])

  async function checkAuthAndLoad() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/admin/login'); return }
    const { data: adminData } = await supabase.from('admin_users').select('id').eq('user_id', user.id).single()
    if (!adminData) { router.push('/admin/login'); return }
    await loadGallery()
    setLoading(false)
  }

  async function loadGallery() {
    const { data } = await supabase.from('gallery').select('*').order('created_at', { ascending: false })
    setGallery(data || [])
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this gallery item?')) return
    await supabase.from('gallery').delete().eq('id', id)
    await loadGallery()
  }

  async function togglePublish(id: string, current: boolean) {
    await supabase.from('gallery').update({ is_published: !current }).eq('id', id)
    await loadGallery()
  }

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center"><Loader2 className="animate-spin text-purple-400" size={48} /></div>

  return (
    <div className="min-h-screen bg-black">
      <nav className="border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/admin/dashboard" className="text-white hover:text-purple-400 transition-colors flex items-center gap-2">
            <ArrowLeft size={20} />
            Back to Dashboard
          </Link>
          <h1 className="text-xl font-bold text-white">Manage Gallery</h1>
          <div className="w-32"></div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-white">Gallery ({gallery.length})</h2>
          <Link
            href="/admin/gallery/new"
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded flex items-center gap-2 transition-colors"
          >
            <Plus size={20} />
            Add Media
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gallery.map((item) => (
            <div key={item.id} className="glass-effect rounded-lg overflow-hidden hover-lift">
              <div className="aspect-square bg-white/5 relative">
                {item.thumbnail_url && (
                  <img
                    src={item.thumbnail_url}
                    alt={item.title_en}
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute top-2 right-2 flex gap-2">
                  <button onClick={() => togglePublish(item.id, item.is_published)} className={`px-3 py-1 rounded-full text-xs cursor-pointer ${
                    item.is_published 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-gray-500/20 text-gray-400'
                  }`}>
                    {item.is_published ? 'Published' : 'Draft'}
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="bg-red-500/20 text-red-400 p-1 rounded-full hover:bg-red-500/40">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-white font-medium mb-2">{item.title_en}</h3>
                <p className="text-gray-400 text-sm capitalize">{item.media_type}</p>
              </div>
            </div>
          ))}
          {gallery.length === 0 && (
            <div className="col-span-full p-12 text-center text-gray-400">
              No media found. Upload your first item!
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
