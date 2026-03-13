import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { Music } from 'lucide-react'

async function getResidentDJs() {
  const { data } = await supabase
    .from('resident_djs')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true })
  
  return data || []
}

export default async function DJsPage() {
  const djs = await getResidentDJs()

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold mb-4">Resident DJs</h1>
        <p className="text-xl text-gray-400 mb-16">Meet our talented roster of resident DJs</p>

        {djs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {djs.map((dj) => (
              <div key={dj.id} className="group">
                <div className="aspect-square bg-gradient-to-br from-purple-900/50 to-black rounded-lg overflow-hidden mb-4 hover-lift">
                  {dj.photo_url ? (
                    <img
                      src={dj.photo_url}
                      alt={dj.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      {dj.logo_url ? (
                        <img
                          src={dj.logo_url}
                          alt={dj.name}
                          className="max-w-[60%] max-h-[60%] object-contain"
                        />
                      ) : (
                        <div className="text-6xl font-bold text-purple-400/20">
                          {dj.name.charAt(0)}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <h3 className="text-2xl font-bold mb-2">{dj.name}</h3>
                {dj.bio_en && (
                  <p className="text-gray-400 text-sm">{dj.bio_en}</p>
                )}
                {dj.social_links && Object.keys(dj.social_links).length > 0 && (
                  <div className="flex gap-3 mt-4">
                    {dj.social_links.instagram && (
                      <a
                        href={dj.social_links.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-purple-400 transition-colors"
                      >
                        Instagram
                      </a>
                    )}
                    {dj.social_links.soundcloud && (
                      <a
                        href={dj.social_links.soundcloud}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-purple-400 transition-colors"
                      >
                        SoundCloud
                      </a>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-xl text-gray-400">DJ profiles coming soon.</p>
          </div>
        )}

        <section className="mt-20 glass-effect rounded-lg p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Want to book a DJ?</h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Our resident DJs are available for private events, corporate functions, and special occasions.
          </p>
          <Link
            href="/book/dj"
            className="inline-flex items-center justify-center px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded transition-all"
          >
            <Music className="mr-2" size={20} />
            Book a DJ
          </Link>
        </section>
      </div>
    </div>
  )
}
