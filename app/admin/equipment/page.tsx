'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Plus, Edit, Trash2, ArrowLeft, Loader2 } from 'lucide-react'

export default function AdminEquipment() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [equipment, setEquipment] = useState<any[]>([])
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => { checkAuthAndLoad() }, [])

  async function checkAuthAndLoad() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/admin/login'); return }
    const { data: adminData } = await supabase.from('admin_users').select('id').eq('user_id', user.id).single()
    if (!adminData) { router.push('/admin/login'); return }
    await loadEquipment()
    setLoading(false)
  }

  async function loadEquipment() {
    const { data } = await supabase.from('equipment').select('*').order('category', { ascending: true })
    setEquipment(data || [])
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this equipment?')) return
    setDeleting(id)
    await supabase.from('equipment').delete().eq('id', id)
    await loadEquipment()
    setDeleting(null)
  }

  async function toggleAvailability(id: string, current: boolean) {
    await supabase.from('equipment').update({ is_available: !current }).eq('id', id)
    await loadEquipment()
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
          <h1 className="text-xl font-bold text-white">Manage Equipment</h1>
          <div className="w-32"></div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-white">Equipment ({equipment.length})</h2>
          <Link
            href="/admin/equipment/new"
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded flex items-center gap-2 transition-colors"
          >
            <Plus size={20} />
            Add Equipment
          </Link>
        </div>

        <div className="glass-effect rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="text-left p-4 text-gray-400 font-semibold">Name</th>
                <th className="text-left p-4 text-gray-400 font-semibold">Category</th>
                <th className="text-left p-4 text-gray-400 font-semibold">Price/Day</th>
                <th className="text-left p-4 text-gray-400 font-semibold">Status</th>
                <th className="text-right p-4 text-gray-400 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {equipment.map((item) => (
                <tr key={item.id} className="border-t border-white/10 hover:bg-white/5 transition-colors">
                  <td className="p-4 text-white font-medium">{item.name_en}</td>
                  <td className="p-4 text-gray-400 capitalize">{item.category}</td>
                  <td className="p-4 text-gray-400">€{item.price}</td>
                  <td className="p-4">
                    <button onClick={() => toggleAvailability(item.id, item.is_available)} className={`px-3 py-1 rounded-full text-xs cursor-pointer ${
                      item.is_available 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {item.is_available ? 'Available' : 'Unavailable'}
                    </button>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin/equipment/${item.id}/edit`}
                        className="text-purple-400 hover:text-purple-300 transition-colors"
                      >
                        <Edit size={18} />
                      </Link>
                      <button onClick={() => handleDelete(item.id)} disabled={deleting === item.id} className="text-red-400 hover:text-red-300 transition-colors disabled:opacity-50">
                        {deleting === item.id ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {equipment.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-400">
                    No equipment found. Add your first item!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}
