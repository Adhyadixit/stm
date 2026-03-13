import Link from 'next/link'
import { Calendar, MapPin } from 'lucide-react'
import { supabase } from '@/lib/supabase'

async function getEvents() {
  const { data } = await supabase
    .from('events')
    .select('*')
    .eq('is_published', true)
    .order('event_date', { ascending: true })
  
  return data || []
}

export default async function EventsPage() {
  const events = await getEvents()
  const upcomingEvents = events.filter(e => new Date(e.event_date) >= new Date())
  const pastEvents = events.filter(e => new Date(e.event_date) < new Date())

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold mb-4">Events</h1>
        <p className="text-xl text-gray-400 mb-16">Upcoming shows and past sessions</p>

        {upcomingEvents.length > 0 && (
          <section className="mb-20">
            <h2 className="text-3xl font-bold mb-8">Upcoming</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => (
                <Link
                  key={event.id}
                  href={`/events/${event.slug}`}
                  className="group relative overflow-hidden rounded-lg hover-lift"
                >
                  <div className="aspect-[3/4] bg-gradient-to-br from-purple-900/50 to-black relative">
                    {event.featured_image && (
                      <img
                        src={event.featured_image}
                        alt={event.title_en}
                        className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                    
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-2xl font-bold mb-3">{event.title_en}</h3>
                      <div className="flex items-center text-sm text-gray-300 mb-2">
                        <Calendar size={16} className="mr-2" />
                        {new Date(event.event_date).toLocaleDateString('en-US', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </div>
                      <div className="flex items-center text-sm text-gray-400">
                        <MapPin size={16} className="mr-2" />
                        {event.location}
                      </div>
                      {event.eventbrite_url && (
                        <div className="mt-4">
                          <span className="inline-flex items-center px-4 py-2 bg-purple-600 text-white text-sm font-semibold rounded">
                            Get Tickets
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {pastEvents.length > 0 && (
          <section>
            <h2 className="text-3xl font-bold mb-8">Past Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {pastEvents.map((event) => (
                <Link
                  key={event.id}
                  href={`/events/${event.slug}`}
                  className="group relative overflow-hidden rounded hover-lift"
                >
                  <div className="aspect-square bg-gradient-to-br from-purple-900/30 to-black relative">
                    {event.featured_image && (
                      <img
                        src={event.featured_image}
                        alt={event.title_en}
                        className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                    
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-lg font-bold mb-1">{event.title_en}</h3>
                      <p className="text-xs text-gray-400">{event.location}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {events.length === 0 && (
          <div className="text-center py-20">
            <p className="text-xl text-gray-400">No events available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  )
}
