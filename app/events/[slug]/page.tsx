'use client'

import { useEffect, useState } from 'react'
import { notFound } from 'next/navigation'
import { Calendar, MapPin, ExternalLink, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useParams } from 'next/navigation'

export default function EventPage() {
  const params = useParams()
  const [event, setEvent] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getEvent() {
      const { data } = await supabase
        .from('events')
        .select('*')
        .eq('slug', params.slug as string)
        .eq('is_published', true)
        .single()
      
      if (!data) {
        notFound()
        return
      }
      
      setEvent(data)
      setLoading(false)
    }
    
    getEvent()
  }, [params.slug])

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-20 flex items-center justify-center">
        <Loader2 className="animate-spin text-purple-400" size={48} />
      </div>
    )
  }

  if (!event) {
    notFound()
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          <div className="aspect-[4/5] bg-gradient-to-br from-purple-900/50 to-black rounded-lg overflow-hidden">
            {event.featured_image && (
              <img
                src={event.featured_image}
                alt={event.title_en}
                className="w-full h-full object-cover"
              />
            )}
          </div>

          <div className="flex flex-col justify-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">{event.title_en}</h1>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center text-lg">
                <Calendar size={24} className="mr-3 text-purple-400" />
                <span>
                  {new Date(event.event_date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </span>
              </div>
              
              <div className="flex items-center text-lg">
                <MapPin size={24} className="mr-3 text-purple-400" />
                <div>
                  <p>{event.location}</p>
                  {event.venue && <p className="text-gray-400 text-sm">{event.venue}</p>}
                </div>
              </div>
            </div>

            {event.description_en && (
              <p className="text-gray-300 mb-8 text-lg leading-relaxed">
                {event.description_en}
              </p>
            )}

            {event.lineup && event.lineup.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Lineup</h3>
                <div className="flex flex-wrap gap-2">
                  {event.lineup.map((artist: string, index: number) => (
                    <span
                      key={index}
                      className="px-4 py-2 glass-effect rounded text-sm"
                    >
                      {artist}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-4 flex-wrap">
              {event.eventbrite_url && (
                <a
                  href={event.eventbrite_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded transition-all hover-lift"
                >
                  Get Tickets on Eventbrite
                  <ExternalLink className="ml-2" size={20} />
                </a>
              )}
              <a
                href="/book/event"
                className="inline-flex items-center justify-center px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded transition-all hover-lift"
              >
                Book This Event
                <Calendar className="ml-2" size={20} />
              </a>
            </div>
          </div>
        </div>

        {event.images && event.images.length > 0 && (
          <section className="mt-16">
            <h2 className="text-3xl font-bold mb-8">Gallery</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {event.images.map((image: string, index: number) => (
                <div key={index} className="aspect-square rounded overflow-hidden">
                  <img
                    src={image}
                    alt={`${event.title_en} - Image ${index + 1}`}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
