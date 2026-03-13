import Link from 'next/link'
import { ArrowRight, MapPin, Play, Heart } from 'lucide-react'
import { supabase } from '@/lib/supabase'

// Dummy data for recent sessions - using reliable Unsplash API
const recentSessions = [
  {
    id: '1',
    location: 'LEEDS',
    title: 'Leeds 2025',
    description: 'We made our long-awaited return to Leeds and celebrated all things house with two of the scene\'s brightest acts, Scarlett O\'Malley & Nyra.',
    imageUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=400&fit=crop',
    slug: 'leeds-2025'
  },
  {
    id: '2',
    location: 'SHENZHEN',
    title: 'Shenzhen 2025',
    description: 'Back in December, we returned to Oil Club in Shenzhen with a cohort of the city\'s finest selectors.',
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=400&fit=crop',
    slug: 'shenzhen-2025'
  },
  {
    id: '3',
    location: 'BOGOTÁ',
    title: 'Bogotá 2025',
    description: 'Last year, we hit up Bogotá to present a healthy cross-section of underground forces in Techno from across the continent.',
    imageUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=400&fit=crop',
    slug: 'bogota-2025'
  },
  {
    id: '4',
    location: 'KUALA LUMPUR',
    title: 'Kuala Lumpur 2025',
    description: 'Back in November, we made our debut in Kuala Lumpur, showcasing the hyper-diversity of the city.',
    imageUrl: 'https://picsum.photos/400/400?random=101',
    slug: 'kuala-lumpur-2025'
  },
  {
    id: '5',
    location: 'LONDON: LEDBYHER',
    title: 'Ledbyher London',
    description: 'Born from a line by William Wordsworth, Ledbyher is one of UK Ug\'s aesthetic outliers.',
    imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop',
    slug: 'london-ledbyher'
  },
  {
    id: '6',
    location: 'SANTIAGO',
    title: 'Santiago AKRIILA',
    description: 'In December, rising global force AKRIILA made her BR debut in her hometown of Santiago, joined by iza tkm and Club Core.',
    imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
    slug: 'santiago-akriila'
  },
  {
    id: '7',
    location: 'WARSAW',
    title: 'Warsaw 2025',
    description: 'We returned to Warsaw for our biggest show to date and brought a cohort of techno heavyweights along for the ride.',
    imageUrl: 'https://picsum.photos/400/400?random=102',
    slug: 'warsaw-2025'
  },
  {
    id: '8',
    location: 'HBO\'S INDUSTRY: NEW YORK',
    title: 'HBO Industry NYC',
    description: 'We joined forces with HBO\'s Industry to celebrate the release of the latest season, with sets from The Dare, Kassie Krut, Chicken & Justin Strauss.',
    imageUrl: 'https://images.unsplash.com/photo-1549497538-303791108f95?w=400&h=400&fit=crop',
    slug: 'hbo-industry-new-york'
  }
]

// Dummy data for upcoming events - using reliable Unsplash API
const upcomingEvents = [
  {
    id: '1',
    title: 'Paris | Thursday',
    date: '07 May 2026',
    location: 'Paris',
    flyerUrl: 'https://picsum.photos/400/400?random=201',
    ticketsAvailable: true
  },
  {
    id: '2',
    title: 'Paris | Friday',
    date: '08 May 2026',
    location: 'Paris',
    flyerUrl: 'https://picsum.photos/400/400?random=202',
    ticketsAvailable: true
  },
  {
    id: '3',
    title: 'Nottingham',
    date: '26 Jun 2026',
    location: 'Nottingham',
    flyerUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
    ticketsAvailable: true
  },
  {
    id: '4',
    title: 'NYC',
    date: '10 Jul 2026',
    location: 'New York',
    flyerUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=400&fit=crop',
    ticketsAvailable: true
  },
  {
    id: '5',
    title: 'London | Friday',
    date: '31 Jul 2026',
    location: 'London',
    flyerUrl: 'https://images.unsplash.com/photo-1549497538-303791108f95?w=400&h=400&fit=crop',
    ticketsAvailable: false,
    signupRequired: true
  }
]

// Dummy data for audio/video - using reliable Unsplash API
const audioVideoContent = [
  {
    id: '1',
    title: 'Restricted',
    location: 'London',
    timeAgo: '1 month ago',
    imageUrl: 'https://picsum.photos/400/400?random=301',
    audioAvailable: true,
    genres: ['Hardstyle', 'Hard Techno']
  },
  {
    id: '2',
    title: 'Charli xcx',
    location: 'New York',
    timeAgo: '1 year ago',
    imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
    audioAvailable: false,
    genres: ['Bass', 'Club', 'House']
  },
  {
    id: '3',
    title: 'Offset',
    location: 'New York',
    timeAgo: '6 months ago',
    imageUrl: 'https://picsum.photos/400/400?random=302',
    audioAvailable: true,
    genres: ['Hip-Hop', 'Rap']
  },
  {
    id: '4',
    title: 'Lens',
    location: 'Nottingham',
    timeAgo: '1 month ago',
    imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop',
    audioAvailable: true,
    genres: ['Drum & Bass']
  },
  {
    id: '5',
    title: 'Underworld',
    location: 'London',
    timeAgo: '6 months ago',
    imageUrl: 'https://images.unsplash.com/photo-1549497538-303791108f95?w=400&h=400&fit=crop',
    audioAvailable: true,
    genres: ['Progressive Techno', 'Rave', 'Trance']
  }
]

export default async function Home() {
  // Still fetch real data for database integration
  const { data: dbEvents } = await supabase
    .from('events')
    .select('*')
    .eq('is_published', true)
    .order('event_date', { ascending: false })
    .limit(10)

  return (
    <main className="min-h-screen bg-black">
      {/* Hero Section with Video Background */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Video background placeholder */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/30 via-blue-900/20 to-black"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1920&h=1080&fit=crop')] bg-cover bg-center opacity-30"></div>
        
        <div className="relative z-10 text-center px-4">
          <h1 className="boiler-room-heading text-7xl md:text-9xl mb-6">
            STM EVENTS
          </h1>
          <p className="text-lg md:text-xl mb-12 tracking-wider">
            Connecting Club Culture To The World
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="/events"
              className="yellow-button px-10 py-4 text-sm flex items-center gap-2"
            >
              <MapPin size={18} />
              FIND AN EVENT
            </Link>
            <Link 
              href="/gallery"
              className="text-white hover:text-gray-300 text-sm uppercase tracking-wider flex items-center gap-2 transition-colors"
            >
              Browse the archive
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Recent Sessions Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentSessions.map((session) => (
              <Link
                key={session.id}
                href={`/events/${session.slug}`}
                className="event-card group"
              >
                <div className="aspect-square bg-gray-900 relative">
                  <img 
                    src={session.imageUrl} 
                    alt={session.location}
                    className="w-full h-full object-cover"
                  />
                  <div className="event-card-overlay"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-white font-bold text-xl mb-2 uppercase tracking-tight">
                      {session.location}
                    </h3>
                    <p className="text-gray-300 text-sm line-clamp-2">
                      {session.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16 px-4 bg-black">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="boiler-room-heading text-4xl md:text-5xl">Upcoming</h2>
            <Link href="/events" className="text-white hover:text-gray-300 flex items-center gap-2 transition-colors">
              <span className="text-sm uppercase tracking-wider">View All</span>
              <ArrowRight size={18} />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="bg-gray-900 overflow-hidden group cursor-pointer">
                <div className="aspect-square relative">
                  <img 
                    src={event.flyerUrl} 
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40"></div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold uppercase text-sm group-hover:text-yellow-400 transition-colors">
                      {event.title}
                    </h3>
                    {event.ticketsAvailable && (
                      <button className="yellow-button px-3 py-1 text-xs">
                        Tickets
                      </button>
                    )}
                    {event.signupRequired && (
                      <button className="yellow-button px-3 py-1 text-xs">
                        Signup
                      </button>
                    )}
                  </div>
                  <div className="text-gray-400 text-xs space-y-1">
                    <p>{event.date}</p>
                    <p>{event.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Audio/Video Content Section */}
      <section className="py-16 px-4 bg-gray-900">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="boiler-room-heading text-4xl md:text-5xl">Video</h2>
            <Link href="/gallery" className="text-white hover:text-gray-300 flex items-center gap-2 transition-colors">
              <span className="text-sm uppercase tracking-wider">View All</span>
              <ArrowRight size={18} />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {audioVideoContent.map((content) => (
              <div key={content.id} className="bg-gray-900 overflow-hidden group cursor-pointer">
                <div className="aspect-square relative">
                  <img 
                    src={content.imageUrl} 
                    alt={content.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Play className="text-white/80" size={48} />
                  </div>
                  {content.audioAvailable && (
                    <div className="absolute top-2 right-2">
                      <span className="bg-yellow-400 text-black px-2 py-1 text-xs font-bold">
                        AUDIO
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-sm group-hover:text-yellow-400 transition-colors">
                        {content.title}
                      </h3>
                      <p className="text-gray-400 text-xs">
                        {content.location} - {content.timeAgo}
                      </p>
                    </div>
                    <button className="text-gray-400 hover:text-red-400 transition-colors">
                      <Heart size={16} />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {content.genres.map((genre) => (
                      <span key={genre} className="text-gray-500 text-xs">
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Audio Section */}
      <section className="py-16 px-4 bg-black">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="boiler-room-heading text-4xl md:text-5xl">Audio</h2>
            <Link href="/gallery" className="text-white hover:text-gray-300 flex items-center gap-2 transition-colors">
              <span className="text-sm uppercase tracking-wider">View All</span>
              <ArrowRight size={18} />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {audioVideoContent.filter(c => c.audioAvailable).map((content) => (
              <div key={content.id} className="bg-gray-900 overflow-hidden group cursor-pointer">
                <div className="aspect-square relative">
                  <img 
                    src={content.imageUrl} 
                    alt={content.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <div className="text-center">
                      <Play className="text-yellow-400 mx-auto mb-2" size={32} />
                      <span className="text-yellow-400 text-xs font-bold">AUDIO AVAILABLE</span>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-sm group-hover:text-yellow-400 transition-colors mb-1">
                    {content.title}
                  </h3>
                  <p className="text-gray-400 text-xs mb-2">
                    {content.location} - {content.timeAgo}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {content.genres.map((genre) => (
                      <span key={genre} className="text-gray-500 text-xs">
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 px-4 bg-gray-900">
        <div className="container mx-auto max-w-3xl">
          <h3 className="boiler-room-heading text-2xl md:text-3xl mb-6 text-center">
            SIGN UP TO OUR MAILING LIST FOR 15% OFF YOUR FIRST ORDER IN THE SHOP PLUS EXCLUSIVE ACCESS TO NEWS AND EVENTS
          </h3>
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              placeholder="email"
              className="flex-1 bg-black border border-white/20 px-6 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 uppercase text-sm"
            />
            <button className="yellow-button px-12 py-4">
              SIGN UP
            </button>
          </div>
          <p className="text-gray-400 text-sm text-center mt-4">
            You can opt out anytime. We will treat your information with respect. For more information about our privacy practices please read our{' '}
            <Link href="/privacy" className="text-yellow-400 hover:text-yellow-300">
              Privacy Policy
            </Link>
            . By clicking above, you agree that we may process your information in accordance with these terms.
          </p>
        </div>
      </section>

          </main>
  )
}
