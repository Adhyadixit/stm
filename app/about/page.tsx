import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { supabase } from '@/lib/supabase'

async function getAboutContent() {
  const { data } = await supabase
    .from('content_pages')
    .select('*')
    .eq('page_key', 'about')
    .single()
  
  return data
}

export default async function AboutPage() {
  const content = await getAboutContent()

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold mb-8">
          {content?.title_en || 'About STM Events'}
        </h1>
        
        <div className="prose prose-invert prose-lg max-w-none">
          <p className="text-xl text-gray-300 leading-relaxed mb-8">
            {content?.content_en || 'STM Events is a premier nightlife and event production company, bringing underground club culture to life.'}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
            <div className="glass-effect p-8 rounded-lg">
              <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
              <p className="text-gray-300">
                To create unforgettable nightlife experiences that connect artists, audiences, and underground culture.
              </p>
            </div>

            <div className="glass-effect p-8 rounded-lg">
              <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
              <p className="text-gray-300">
                To be the leading force in underground club culture, showcasing the best talent and production quality.
              </p>
            </div>
          </div>

          <h2 className="text-3xl font-bold mb-6 mt-12">What We Do</h2>
          <p className="text-gray-300 mb-6">
            STM Events specializes in creating immersive nightlife experiences through:
          </p>
          
          <ul className="space-y-4 mb-12">
            <li className="flex items-start">
              <span className="text-purple-400 mr-3 mt-1">→</span>
              <span className="text-gray-300">Professional event production with cutting-edge sound and visuals</span>
            </li>
            <li className="flex items-start">
              <span className="text-purple-400 mr-3 mt-1">→</span>
              <span className="text-gray-300">Curated lineups featuring the best underground talent</span>
            </li>
            <li className="flex items-start">
              <span className="text-purple-400 mr-3 mt-1">→</span>
              <span className="text-gray-300">Equipment rental services for events and venues</span>
            </li>
            <li className="flex items-start">
              <span className="text-purple-400 mr-3 mt-1">→</span>
              <span className="text-gray-300">DJ booking and artist management</span>
            </li>
          </ul>

          <div className="bg-gradient-to-r from-purple-900/20 to-transparent border-l-4 border-purple-500 p-8 rounded my-12">
            <p className="text-xl italic text-gray-200">
              "We believe in the power of music to bring people together and create moments that last a lifetime."
            </p>
          </div>

          <h2 className="text-3xl font-bold mb-6">Get Involved</h2>
          <p className="text-gray-300 mb-8">
            Whether you're looking to attend our events, book our DJs, or collaborate on a production, we'd love to hear from you.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/events"
              className="inline-flex items-center justify-center px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded transition-all hover-lift"
            >
              View Events
              <ArrowRight className="ml-2" size={20} />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 glass-effect hover:bg-white/10 text-white font-semibold rounded transition-all hover-lift"
            >
              Contact Us
              <ArrowRight className="ml-2" size={20} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
