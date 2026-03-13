'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Plus, Edit, Trash2, ArrowLeft, Loader2 } from 'lucide-react'

export default function AdminDJs() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [djs, setDjs] = useState<any[]>([])
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => { checkAuthAndLoad() }, [])

  async function checkAuthAndLoad() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/admin/login'); return }
    const { data: adminData } = await supabase.from('admin_users').select('id').eq('user_id', user.id).single()
    if (!adminData) { router.push('/admin/login'); return }
    await loadDJs()
    setLoading(false)
  }

  async function loadDJs() {
    const { data } = await supabase.from('resident_djs').select('*').order('name', { ascending: true })
    setDjs(data || [])
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this DJ?')) return
    setDeleting(id)
    await supabase.from('resident_djs').delete().eq('id', id)
    await loadDJs()
    setDeleting(null)
  }

  async function toggleActive(id: string, current: boolean) {
    await supabase.from('resident_djs').update({ is_active: !current }).eq('id', id)
    await loadDJs()
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
          <h1 className="text-xl font-bold text-white">Manage DJs</h1>
          <div className="w-32"></div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-white">Resident DJs ({djs.length})</h2>
          <Link
            href="/admin/djs/new"
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded flex items-center gap-2 transition-colors"
          >
            <Plus size={20} />
            Add DJ
          </Link>
        </div>

        <div className="glass-effect rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="text-left p-4 text-gray-400 font-semibold">Name</th>
                <th className="text-left p-4 text-gray-400 font-semibold">Bio</th>
                <th className="text-left p-4 text-gray-400 font-semibold">Status</th>
                <th className="text-right p-4 text-gray-400 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {djs.map((dj) => (
                <tr key={dj.id} className="border-t border-white/10 hover:bg-white/5 transition-colors">
                  <td className="p-4 text-white font-medium">{dj.name}</td>
                  <td className="p-4 text-gray-400 max-w-md truncate">{dj.bio_en}</td>
                  <td className="p-4">
                    <button onClick={() => toggleActive(dj.id, dj.is_active)} className={`px-3 py-1 rounded-full text-xs cursor-pointer ${
                      dj.is_active 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {dj.is_active ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin/djs/${dj.id}/edit`}
                        className="text-purple-400 hover:text-purple-300 transition-colors"
                      >
                        <Edit size={18} />
                      </Link>
                      <button onClick={() => handleDelete(dj.id)} disabled={deleting === dj.id} className="text-red-400 hover:text-red-300 transition-colors disabled:opacity-50">
                        {deleting === dj.id ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {djs.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-400">
                    No DJs found. Add your first resident DJ!
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
