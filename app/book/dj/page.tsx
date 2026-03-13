'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Music, Calendar, Users, Mail, Phone, MapPin, Save, Clock } from 'lucide-react'

export default function DJBooking() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    event_name: '',
    event_date: '',
    event_time: '',
    venue: '',
    genre_preference: '',
    dj_preference: '',
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
        .from('dj_bookings')
        .insert({
          ...formData,
          booking_type: 'dj',
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
              <Music className="text-green-400" size={32} />
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">DJ Booking Request Received!</h1>
            <p className="text-gray-300 mb-8">
              Thank you for your DJ booking request. We'll check DJ availability and get back to you within 24 hours.
            </p>
            <div className="bg-white/5 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-white mb-4">What happens next?</h3>
              <div className="space-y-3 text-left text-gray-300">
                <p>📧 We'll send an email confirmation to {formData.email}</p>
                <p>📞 Our team will call you at {formData.phone} within 24 hours</p>
                <p>🎵 We'll confirm DJ availability for {formData.event_date}</p>
                <p>💰 We'll provide a detailed quote based on your requirements</p>
                <p>🎧 We'll discuss music preferences and event details</p>
              </div>
            </div>
            <div className="flex gap-4 justify-center">
              <Link href="/" className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded transition-colors">
                Back to Home
              </Link>
              <Link href="/djs" className="bg-white/5 hover:bg-white/10 text-white px-6 py-3 rounded transition-colors">
                View Our DJs
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
        <Link href="/djs" className="text-white hover:text-purple-400 transition-colors flex items-center gap-2 mb-8">
          <ArrowLeft size={20} />
          Back to DJs
        </Link>

        <div className="glass-effect rounded-lg p-8">
          <h1 className="text-4xl font-bold text-white mb-4">Book a DJ</h1>
          <p className="text-gray-300 mb-8">
            Fill out the form below and we'll check DJ availability and provide a quote within 24 hours.
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
                  <Music size={16} />
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
                  Event Date *
                </label>
                <input
                  type="date"
                  value={formData.event_date}
                  onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-white mb-2">
                  <Clock size={16} />
                  Event Time *
                </label>
                <input
                  type="time"
                  value={formData.event_time}
                  onChange={(e) => setFormData({ ...formData, event_time: e.target.value })}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white mb-2">Music Genre Preference *</label>
                <select
                  value={formData.genre_preference}
                  onChange={(e) => setFormData({ ...formData, genre_preference: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                  required
                >
                  <option value="">Select genre</option>
                  <option value="techno">Techno</option>
                  <option value="house">House</option>
                  <option value="drum_bass">Drum & Bass</option>
                  <option value="trance">Trance</option>
                  <option value="hip_hop">Hip Hop</option>
                  <option value="electronic">Electronic</option>
                  <option value="mixed">Mixed Genres</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-white mb-2">Preferred DJ (Optional)</label>
                <select
                  value={formData.dj_preference}
                  onChange={(e) => setFormData({ ...formData, dj_preference: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="">No preference</option>
                  <option value="DJ Techmaster">DJ Techmaster</option>
                  <option value="Luna Beats">Luna Beats</option>
                  <option value="Bass Commander">Bass Commander</option>
                </select>
                <p className="text-gray-400 text-sm mt-2">
                  Check our <Link href="/djs" className="text-purple-400 hover:text-purple-300">resident DJs</Link> for options
                </p>
              </div>
            </div>

            <div>
              <label className="block text-white mb-2">Budget Range</label>
              <input
                type="text"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                placeholder="€300-500, €800+, etc."
                className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-white mb-2">Event Requirements</label>
              <textarea
                value={formData.requirements}
                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                rows={4}
                placeholder="Event type, duration, special requests, equipment needed, age group, venue size, etc."
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
              {loading ? 'Submitting...' : 'Submit DJ Booking Request'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
