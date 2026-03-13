'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save } from 'lucide-react'

export default function NewDJ() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    name: '',
    bio_en: '',
    bio_de: '',
    photo_url: '',
    social_links: { instagram: '', soundcloud: '', spotify: '' },
    is_active: true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { error: insertError } = await supabase
        .from('resident_djs')
        .insert(formData)

      if (insertError) throw insertError
      router.push('/admin/djs')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black">
      <nav className="border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/admin/djs" className="text-white hover:text-purple-400 transition-colors flex items-center gap-2">
            <ArrowLeft size={20} />
            Back to DJs
          </Link>
          <h1 className="text-xl font-bold text-white">New DJ</h1>
          <div className="w-32"></div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="glass-effect p-8 rounded-lg">
          <div className="mb-6">
            <label className="block text-white mb-2 text-sm">Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-purple-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-white mb-2 text-sm">Bio (English)</label>
              <textarea
                value={formData.bio_en}
                onChange={(e) => setFormData({ ...formData, bio_en: e.target.value })}
                rows={4}
                className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-white mb-2 text-sm">Bio (German)</label>
              <textarea
                value={formData.bio_de}
                onChange={(e) => setFormData({ ...formData, bio_de: e.target.value })}
                rows={4}
                className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-white mb-2 text-sm">Photo URL</label>
            <input
              type="url"
              value={formData.photo_url}
              onChange={(e) => setFormData({ ...formData, photo_url: e.target.value })}
              placeholder="https://..."
              className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-white mb-2 text-sm">Instagram URL</label>
              <input
                type="url"
                value={formData.social_links.instagram}
                onChange={(e) => setFormData({ ...formData, social_links: { ...formData.social_links, instagram: e.target.value } })}
                className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-white mb-2 text-sm">SoundCloud URL</label>
              <input
                type="url"
                value={formData.social_links.soundcloud}
                onChange={(e) => setFormData({ ...formData, social_links: { ...formData.social_links, soundcloud: e.target.value } })}
                className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-white mb-2 text-sm">Spotify URL</label>
              <input
                type="url"
                value={formData.social_links.spotify}
                onChange={(e) => setFormData({ ...formData, social_links: { ...formData.social_links, spotify: e.target.value } })}
                className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="flex items-center gap-2 text-white cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="w-5 h-5 rounded border-white/10 bg-white/5 text-purple-600 focus:ring-purple-500"
              />
              <span>Active</span>
            </label>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              <Save size={20} />
              {loading ? 'Creating...' : 'Add DJ'}
            </button>
            <Link href="/admin/djs" className="bg-white/5 hover:bg-white/10 text-white px-6 py-3 rounded transition-colors">
              Cancel
            </Link>
          </div>
        </form>
      </main>
    </div>
  )
}
