'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Save, Loader2, Plus, X, Image as ImageIcon } from 'lucide-react'
import Link from 'next/link'

interface EquipmentData {
  id: string
  name_en: string
  name_pl: string
  description_en: string
  description_pl: string
  category: string
  price: number
  is_available: boolean
  images: string[]
  specifications: Record<string, any>
  features: string[]
  reviews: Array<{
    id: string
    author: string
    rating: number
    comment: string
    date: string
    verified: boolean
  }>
  fomo_sections: Array<{
    id: string
    type: 'stock' | 'timer' | 'social_proof' | 'urgency'
    content: string
    enabled: boolean
  }>
  seo_title: string
  seo_description: string
}

export default function EditEquipment() {
  const router = useRouter()
  const params = useParams()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [equipment, setEquipment] = useState<EquipmentData | null>(null)
  const [newImage, setNewImage] = useState('')
  const [newFeature, setNewFeature] = useState('')
  const [newSpecKey, setNewSpecKey] = useState('')
  const [newSpecValue, setNewSpecValue] = useState('')

  useEffect(() => {
    if (params.id) {
      loadEquipment()
    }
  }, [params.id])

  async function loadEquipment() {
    const { data } = await supabase
      .from('equipment')
      .select('*')
      .eq('id', params.id)
      .single()

    if (data) {
      // Parse JSON fields if they exist
      const parsedData = {
        ...data,
        images: data.images || [],
        specifications: data.specifications || {},
        features: data.features || [],
        reviews: data.reviews || [],
        fomo_sections: data.fomo_sections || [],
      }
      setEquipment(parsedData)
    }
    setLoading(false)
  }

  async function handleSave() {
    if (!equipment) return
    
    setSaving(true)
    await supabase
      .from('equipment')
      .update({
        name_en: equipment.name_en,
        name_pl: equipment.name_pl,
        description_en: equipment.description_en,
        description_pl: equipment.description_pl,
        category: equipment.category,
        price: equipment.price,
        is_available: equipment.is_available,
        images: equipment.images,
        specifications: equipment.specifications,
        features: equipment.features,
        reviews: equipment.reviews,
        fomo_sections: equipment.fomo_sections,
        seo_title: equipment.seo_title,
        seo_description: equipment.seo_description,
      })
      .eq('id', equipment.id)

    setSaving(false)
    router.push('/admin/equipment')
  }

  function addImage() {
    if (newImage && equipment) {
      setEquipment({
        ...equipment,
        images: [...equipment.images, newImage]
      })
      setNewImage('')
    }
  }

  function removeImage(index: number) {
    if (equipment) {
      setEquipment({
        ...equipment,
        images: equipment.images.filter((_, i) => i !== index)
      })
    }
  }

  function addFeature() {
    if (newFeature && equipment) {
      setEquipment({
        ...equipment,
        features: [...equipment.features, newFeature]
      })
      setNewFeature('')
    }
  }

  function removeFeature(index: number) {
    if (equipment) {
      setEquipment({
        ...equipment,
        features: equipment.features.filter((_, i) => i !== index)
      })
    }
  }

  function addSpecification() {
    if (newSpecKey && newSpecValue && equipment) {
      setEquipment({
        ...equipment,
        specifications: {
          ...equipment.specifications,
          [newSpecKey]: newSpecValue
        }
      })
      setNewSpecKey('')
      setNewSpecValue('')
    }
  }

  function removeSpecification(key: string) {
    if (equipment) {
      const newSpecs = { ...equipment.specifications }
      delete newSpecs[key]
      setEquipment({
        ...equipment,
        specifications: newSpecs
      })
    }
  }

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center"><Loader2 className="animate-spin text-purple-400" size={48} /></div>
  if (!equipment) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Equipment not found</div>

  return (
    <div className="min-h-screen bg-black">
      <nav className="border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/admin/equipment" className="text-white hover:text-purple-400 transition-colors flex items-center gap-2">
            <ArrowLeft size={20} />
            Back to Equipment
          </Link>
          <h1 className="text-xl font-bold text-white">Edit Equipment</h1>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Basic Information */}
            <div className="glass-effect rounded-lg p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Basic Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Name (English)</label>
                  <input
                    type="text"
                    value={equipment.name_en}
                    onChange={(e) => setEquipment({...equipment, name_en: e.target.value})}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
                    placeholder="Equipment name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Name (Polish)</label>
                  <input
                    type="text"
                    value={equipment.name_pl}
                    onChange={(e) => setEquipment({...equipment, name_pl: e.target.value})}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
                    placeholder="Nazwa sprzętu"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-400 mb-2">Category</label>
                <select
                  value={equipment.category}
                  onChange={(e) => setEquipment({...equipment, category: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                >
                  <option value="dj">DJ Equipment</option>
                  <option value="sound">Sound Systems</option>
                  <option value="lighting">Lighting</option>
                  <option value="video">Video</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-400 mb-2">Price per Day (€)</label>
                <input
                  type="number"
                  value={equipment.price}
                  onChange={(e) => setEquipment({...equipment, price: parseFloat(e.target.value)})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
                  placeholder="0.00"
                />
              </div>

              <div className="mt-6">
                <label className="flex items-center gap-3 text-white">
                  <input
                    type="checkbox"
                    checked={equipment.is_available}
                    onChange={(e) => setEquipment({...equipment, is_available: e.target.checked})}
                    className="w-5 h-5 bg-white/10 border border-white/20 rounded focus:border-purple-500 focus:outline-none"
                  />
                  Available for Rental
                </label>
              </div>
            </div>

            {/* Descriptions */}
            <div className="glass-effect rounded-lg p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Descriptions</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Description (English)</label>
                  <textarea
                    value={equipment.description_en}
                    onChange={(e) => setEquipment({...equipment, description_en: e.target.value})}
                    rows={6}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none resize-none"
                    placeholder="Detailed description in English..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Description (Polish)</label>
                  <textarea
                    value={equipment.description_pl}
                    onChange={(e) => setEquipment({...equipment, description_pl: e.target.value})}
                    rows={6}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none resize-none"
                    placeholder="Szczegółowy opis po polsku..."
                  />
                </div>
              </div>
            </div>

            {/* Images Gallery */}
            <div className="glass-effect rounded-lg p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Product Images</h2>
              
              <div className="mb-6">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newImage}
                    onChange={(e) => setNewImage(e.target.value)}
                    className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
                    placeholder="Enter image URL..."
                  />
                  <button
                    onClick={addImage}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <Plus size={20} />
                    Add Image
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {equipment.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Product image ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
                {equipment.images.length === 0 && (
                  <div className="col-span-full text-center py-8 text-gray-400 border-2 border-dashed border-white/20 rounded-lg">
                    <ImageIcon size={48} className="mx-auto mb-4 opacity-50" />
                    <p>No images added yet</p>
                  </div>
                )}
              </div>
            </div>

            {/* Features */}
            <div className="glass-effect rounded-lg p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Product Features</h2>
              
              <div className="mb-6">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
                    placeholder="Enter feature..."
                  />
                  <button
                    onClick={addFeature}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <Plus size={20} />
                    Add Feature
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {equipment.features.map((feature, index) => (
                  <div key={index} className="flex items-center justify-between bg-white/5 p-3 rounded-lg">
                    <span className="text-white">{feature}</span>
                    <button
                      onClick={() => removeFeature(index)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ))}
                {equipment.features.length === 0 && (
                  <div className="text-center py-8 text-gray-400 border-2 border-dashed border-white/20 rounded-lg">
                    <p>No features added yet</p>
                  </div>
                )}
              </div>
            </div>

            {/* Specifications */}
            <div className="glass-effect rounded-lg p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Technical Specifications</h2>
              
              <div className="mb-6">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newSpecKey}
                    onChange={(e) => setNewSpecKey(e.target.value)}
                    className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
                    placeholder="Specification name..."
                  />
                  <input
                    type="text"
                    value={newSpecValue}
                    onChange={(e) => setNewSpecValue(e.target.value)}
                    className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
                    placeholder="Specification value..."
                  />
                  <button
                    onClick={addSpecification}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <Plus size={20} />
                    Add Spec
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {Object.entries(equipment.specifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between bg-white/5 p-3 rounded-lg">
                    <div>
                      <span className="text-white font-medium">{key}:</span>
                      <span className="text-gray-300 ml-2">{value}</span>
                    </div>
                    <button
                      onClick={() => removeSpecification(key)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ))}
                {Object.keys(equipment.specifications).length === 0 && (
                  <div className="text-center py-8 text-gray-400 border-2 border-dashed border-white/20 rounded-lg">
                    <p>No specifications added yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* SEO Settings */}
            <div className="glass-effect rounded-lg p-6">
              <h3 className="text-lg font-bold text-white mb-4">SEO Settings</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">SEO Title</label>
                  <input
                    type="text"
                    value={equipment.seo_title || ''}
                    onChange={(e) => setEquipment({...equipment, seo_title: e.target.value})}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
                    placeholder="SEO title..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">SEO Description</label>
                  <textarea
                    value={equipment.seo_description || ''}
                    onChange={(e) => setEquipment({...equipment, seo_description: e.target.value})}
                    rows={3}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none resize-none"
                    placeholder="SEO description..."
                  />
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="glass-effect rounded-lg p-6">
              <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
              
              <div className="space-y-3">
                <Link
                  href={`/equipment/${equipment.id}`}
                  target="_blank"
                  className="block w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg text-center transition-colors"
                >
                  View Product Page
                </Link>
                
                <button
                  onClick={() => setEquipment({...equipment, is_available: !equipment.is_available})}
                  className={`w-full px-4 py-3 rounded-lg transition-colors ${
                    equipment.is_available 
                      ? 'bg-red-600 hover:bg-red-700 text-white' 
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  {equipment.is_available ? 'Mark as Unavailable' : 'Mark as Available'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
