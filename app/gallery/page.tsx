import { supabase } from '@/lib/supabase'

async function getGalleryItems() {
  const { data } = await supabase
    .from('gallery')
    .select('*')
    .eq('is_published', true)
    .order('display_order', { ascending: true })
  
  return data || []
}

export default async function GalleryPage() {
  const items = await getGalleryItems()

  const categories = {
    image: items.filter(i => i.media_type === 'image'),
    video: items.filter(i => i.media_type === 'video'),
    aftermovie: items.filter(i => i.media_type === 'aftermovie'),
    dj_set: items.filter(i => i.media_type === 'dj_set'),
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold mb-4">Gallery</h1>
        <p className="text-xl text-gray-400 mb-16">Event photos, videos, and DJ sets</p>

        {items.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="group relative aspect-square overflow-hidden rounded hover-lift cursor-pointer"
              >
                {item.media_type === 'image' ? (
                  <img
                    src={item.media_url}
                    alt={item.title_en}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="relative w-full h-full">
                    {item.thumbnail_url ? (
                      <img
                        src={item.thumbnail_url}
                        alt={item.title_en}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-purple-900/50 to-black flex items-center justify-center">
                        <svg className="w-16 h-16 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                        </svg>
                      </div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                      </svg>
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-sm font-semibold">{item.title_en}</p>
                    <p className="text-xs text-gray-400 capitalize">{item.media_type.replace('_', ' ')}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-xl text-gray-400">No gallery items available yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
