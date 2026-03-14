'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save } from 'lucide-react'
import { ImageUpload } from '@/components/ImageUpload'

export default function NewEquipment() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    name_en: '',
    name_de: '',
    description_en: '',
    description_de: '',
    category: 'sound',
    price: '',
    is_available: true,
    image_url: '',
    cloudinary_public_id: '',
    additional_images: [],
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { error: insertError } = await supabase
        .from('equipment')
        .insert({
          ...formData,
          price: parseFloat(formData.price),
        })

      if (insertError) throw insertError

      router.push('/admin/equipment')
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
          <Link href="/admin/equipment" className="text-white hover:text-purple-400 transition-colors flex items-center gap-2">
            <ArrowLeft size={20} />
            Back to Equipment
          </Link>
          <h1 className="text-xl font-bold text-white">New Equipment</h1>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-white mb-2 text-sm">Name (English) *</label>
              <input
                type="text"
                value={formData.name_en}
                onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                required
              />
            </div>

            <div>
              <label className="block text-white mb-2 text-sm">Name (German)</label>
              <input
                type="text"
                value={formData.name_de}
                onChange={(e) => setFormData({ ...formData, name_de: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-white mb-2 text-sm">Description (English)</label>
              <textarea
                value={formData.description_en}
                onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                rows={4}
                className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-white mb-2 text-sm">Description (German)</label>
              <textarea
                value={formData.description_de}
                onChange={(e) => setFormData({ ...formData, description_de: e.target.value })}
                rows={4}
                className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-white mb-2 text-sm">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                required
              >
                <option value="sound">Sound</option>
                <option value="dj">DJ</option>
                <option value="lighting">Lighting</option>
              </select>
            </div>

            <div>
              <label className="block text-white mb-2 text-sm">Price per Day (EUR) *</label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                required
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-white mb-2 text-sm">Equipment Image</label>
            <ImageUpload
              onUpload={(url, publicId) => setFormData({ 
                ...formData, 
                image_url: url, 
                cloudinary_public_id: publicId 
              })}
              currentImage={formData.image_url}
              folder="equipment"
              className="mb-4"
            />
          </div>

          <div className="mb-6">
            <label className="flex items-center gap-2 text-white cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_available}
                onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })}
                className="w-5 h-5 rounded border-white/10 bg-white/5 text-purple-600 focus:ring-purple-500"
              />
              <span>Available for rental</span>
            </label>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              <Save size={20} />
              {loading ? 'Creating...' : 'Create Equipment'}
            </button>
            <Link
              href="/admin/equipment"
              className="bg-white/5 hover:bg-white/10 text-white px-6 py-3 rounded transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </main>
    </div>
  )
}
