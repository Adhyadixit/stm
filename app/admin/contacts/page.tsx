'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Loader2, Trash2, Mail, Clock } from 'lucide-react'

export default function AdminContacts() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [contacts, setContacts] = useState<any[]>([])
  const [selected, setSelected] = useState<any | null>(null)

  useEffect(() => { checkAuthAndLoad() }, [])

  async function checkAuthAndLoad() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/admin/login'); return }
    const { data: adminData } = await supabase.from('admin_users').select('id').eq('user_id', user.id).single()
    if (!adminData) { router.push('/admin/login'); return }
    await loadContacts()
    setLoading(false)
  }

  async function loadContacts() {
    const { data } = await supabase.from('contact_submissions').select('*').order('created_at', { ascending: false })
    setContacts(data || [])
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this message?')) return
    await supabase.from('contact_submissions').delete().eq('id', id)
    if (selected?.id === id) setSelected(null)
    await loadContacts()
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
          <h1 className="text-xl font-bold text-white">Contact Submissions</h1>
          <div className="w-32"></div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-white mb-8">Messages ({contacts.length})</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-3">
            {contacts.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelected(c)}
                className={`w-full text-left p-4 rounded-lg transition-colors ${
                  selected?.id === c.id ? 'bg-purple-600/20 border border-purple-500' : 'glass-effect hover:bg-white/10'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="text-white font-medium truncate">{c.name}</span>
                  <button onClick={(e) => { e.stopPropagation(); handleDelete(c.id) }} className="text-red-400 hover:text-red-300 ml-2 flex-shrink-0">
                    <Trash2 size={14} />
                  </button>
                </div>
                <p className="text-gray-400 text-sm truncate">{c.subject || c.message?.substring(0, 50)}</p>
                <div className="flex items-center gap-1 mt-2 text-gray-500 text-xs">
                  <Clock size={12} />
                  {new Date(c.created_at).toLocaleDateString()}
                </div>
              </button>
            ))}
            {contacts.length === 0 && (
              <div className="p-8 text-center text-gray-400 glass-effect rounded-lg">
                No messages yet.
              </div>
            )}
          </div>

          <div className="lg:col-span-2">
            {selected ? (
              <div className="glass-effect rounded-lg p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-1">{selected.name}</h3>
                    <a href={`mailto:${selected.email}`} className="text-purple-400 hover:text-purple-300 flex items-center gap-1">
                      <Mail size={16} />
                      {selected.email}
                    </a>
                    {selected.phone && <p className="text-gray-400 mt-1">{selected.phone}</p>}
                  </div>
                  <span className="text-gray-500 text-sm">
                    {new Date(selected.created_at).toLocaleString()}
                  </span>
                </div>
                {selected.subject && (
                  <h4 className="text-lg font-semibold text-white mb-4">Subject: {selected.subject}</h4>
                )}
                <div className="bg-white/5 rounded-lg p-6">
                  <p className="text-gray-300 whitespace-pre-wrap">{selected.message}</p>
                </div>
                <div className="mt-6">
                  <a
                    href={`mailto:${selected.email}?subject=Re: ${selected.subject || 'Your message to STM Events'}`}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded inline-flex items-center gap-2 transition-colors"
                  >
                    <Mail size={18} />
                    Reply via Email
                  </a>
                </div>
              </div>
            ) : (
              <div className="glass-effect rounded-lg p-12 text-center text-gray-400">
                Select a message to view details
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
