'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Package, Calendar, Users, Mail, Phone, MapPin, Save } from 'lucide-react'

export default function EquipmentBooking() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    event_name: '',
    rental_date: '',
    return_date: '',
    venue: '',
    equipment_needed: '',
    budget: '',
    requirements: '',
    hear_about_us: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Save to database
      const { error: insertError } = await supabase
        .from('equipment_bookings')
        .insert({
          ...formData,
          booking_type: 'equipment',
          status: 'pending',
        })

      if (insertError) throw insertError

      setSuccess(true)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-black pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="glass-effect rounded-lg p-12 text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="text-green-400" size={32} />
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">Equipment Rental Request Received!</h1>
            <p className="text-gray-300 mb-8">
              Thank you for your equipment rental request. We'll check availability and get back to you within 24 hours with a quote.
            </p>
            <div className="bg-white/5 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-white mb-4">What happens next?</h3>
              <div className="space-y-3 text-left text-gray-300">
                <p>📧 We'll send an email confirmation to {formData.email}</p>
                <p>📞 Our team will call you at {formData.phone} within 24 hours</p>
                <p>🔧 We'll confirm equipment availability for your dates</p>
                <p>💰 We'll provide a detailed quote including delivery/setup</p>
                <p>📅 We'll schedule pickup/delivery logistics</p>
              </div>
            </div>
            <div className="flex gap-4 justify-center">
              <Link href="/" className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded transition-colors">
                Back to Home
              </Link>
              <Link href="/equipment" className="bg-white/5 hover:bg-white/10 text-white px-6 py-3 rounded transition-colors">
                View Equipment Catalog
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4">
        <Link href="/equipment" className="text-white hover:text-purple-400 transition-colors flex items-center gap-2 mb-8">
          <ArrowLeft size={20} />
          Back to Equipment
        </Link>

        <div className="glass-effect rounded-lg p-8">
          <h1 className="text-4xl font-bold text-white mb-4">Rent Equipment</h1>
          <p className="text-gray-300 mb-8">
            Fill out the form below and we'll check availability and provide a quote within 24 hours.
          </p>

          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center gap-2 text-white mb-2">
                  <Users size={16} />
                  Your Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-white mb-2">
                  <Mail size={16} />
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center gap-2 text-white mb-2">
                  <Phone size={16} />
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-white mb-2">
                  <Package size={16} />
                  Event Name *
                </label>
                <input
                  type="text"
                  value={formData.event_name}
                  onChange={(e) => setFormData({ ...formData, event_name: e.target.value })}
                  placeholder="Birthday Party, Corporate Event, etc."
                  className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="flex items-center gap-2 text-white mb-2">
                  <Calendar size={16} />
                  Rental Date *
                </label>
                <input
                  type="date"
                  value={formData.rental_date}
                  onChange={(e) => setFormData({ ...formData, rental_date: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-white mb-2">
                  <Calendar size={16} />
                  Return Date *
                </label>
                <input
                  type="date"
                  value={formData.return_date}
                  onChange={(e) => setFormData({ ...formData, return_date: e.target.value })}
                  min={formData.rental_date}
                  className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-white mb-2">
                  <MapPin size={16} />
                  Venue Location *
                </label>
                <input
                  type="text"
                  value={formData.venue}
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                  placeholder="Berlin, Germany or specific venue"
                  className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-white mb-2">Equipment Needed *</label>
              <textarea
                value={formData.equipment_needed}
                onChange={(e) => setFormData({ ...formData, equipment_needed: e.target.value })}
                rows={4}
                placeholder="List the equipment you need (e.g., 2x Pioneer CDJ-3000, 1x Allen & Heath Xone:96, 4x Martin MAC Aura XB, Funktion-One sound system)"
                className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                required
              />
              <p className="text-gray-400 text-sm mt-2">
                Check our <Link href="/equipment" className="text-purple-400 hover:text-purple-300">equipment catalog</Link> for available items
              </p>
            </div>

            <div>
              <label className="block text-white mb-2">Budget Range</label>
              <input
                type="text"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                placeholder="€500-1000, €1500+, etc."
                className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-white mb-2">Additional Requirements</label>
              <textarea
                value={formData.requirements}
                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                rows={3}
                placeholder="Delivery/setup needed, technician required, specific technical requirements, etc."
                className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-white mb-2">How did you hear about us?</label>
              <select
                value={formData.hear_about_us}
                onChange={(e) => setFormData({ ...formData, hear_about_us: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-purple-500"
              >
                <option value="">Select an option</option>
                <option value="social_media">Social Media</option>
                <option value="friend">Friend Recommendation</option>
                <option value="google">Google Search</option>
                <option value="event">Attended Our Event</option>
                <option value="other">Other</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white px-6 py-4 rounded font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Save size={20} />
              {loading ? 'Submitting...' : 'Submit Rental Request'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
