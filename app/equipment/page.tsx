import Link from 'next/link'
import { Mail, Phone, Package } from 'lucide-react'
import { supabase } from '@/lib/supabase'

async function getEquipment() {
  const { data } = await supabase
    .from('equipment')
    .select('*')
    .eq('is_available', true)
    .order('display_order', { ascending: true })
  
  return data || []
}

export default async function EquipmentPage() {
  const equipment = await getEquipment()

  const categories = {
    sound: equipment.filter(e => e.category === 'sound'),
    dj: equipment.filter(e => e.category === 'dj'),
    lighting: equipment.filter(e => e.category === 'lighting'),
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold mb-4">Equipment Rental</h1>
        <p className="text-xl text-gray-400 mb-16">Professional sound, DJ, and lighting equipment</p>

        {categories.sound.length > 0 && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8">Sound Systems</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.sound.map((item) => (
                <div key={item.id} className="glass-effect rounded-lg overflow-hidden hover-lift">
                  <Link href={`/equipment/${item.id}`}>
                    {item.images && item.images.length > 0 && (
                      <div className="aspect-video bg-gradient-to-br from-purple-900/30 to-black">
                        <img
                          src={item.images[0]}
                          alt={item.name_en}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </Link>
                  <div className="p-6">
                    <Link href={`/equipment/${item.id}`}>
                      <h3 className="text-xl font-bold mb-2 hover:text-purple-400 transition-colors">{item.name_en}</h3>
                    </Link>
                    <p className="text-gray-400 text-sm mb-4">{item.description_en}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-purple-400">
                        €{item.price}
                        <span className="text-sm text-gray-400">/day</span>
                      </span>
                      <Link
                        href={`/equipment/${item.id}`}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {categories.dj.length > 0 && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8">DJ Equipment</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.dj.map((item) => (
                <div key={item.id} className="glass-effect rounded-lg overflow-hidden hover-lift">
                  <Link href={`/equipment/${item.id}`}>
                    {item.images && item.images.length > 0 && (
                      <div className="aspect-video bg-gradient-to-br from-purple-900/30 to-black">
                        <img
                          src={item.images[0]}
                          alt={item.name_en}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </Link>
                  <div className="p-6">
                    <Link href={`/equipment/${item.id}`}>
                      <h3 className="text-xl font-bold mb-2 hover:text-purple-400 transition-colors">{item.name_en}</h3>
                    </Link>
                    <p className="text-gray-400 text-sm mb-4">{item.description_en}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-purple-400">
                        €{item.price}
                        <span className="text-sm text-gray-400">/day</span>
                      </span>
                      <Link
                        href={`/equipment/${item.id}`}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {categories.lighting.length > 0 && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8">Lighting Equipment</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.lighting.map((item) => (
                <div key={item.id} className="glass-effect rounded-lg overflow-hidden hover-lift">
                  <Link href={`/equipment/${item.id}`}>
                    {item.images && item.images.length > 0 && (
                      <div className="aspect-video bg-gradient-to-br from-purple-900/30 to-black">
                        <img
                          src={item.images[0]}
                          alt={item.name_en}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </Link>
                  <div className="p-6">
                    <Link href={`/equipment/${item.id}`}>
                      <h3 className="text-xl font-bold mb-2 hover:text-purple-400 transition-colors">{item.name_en}</h3>
                    </Link>
                    <p className="text-gray-400 text-sm mb-4">{item.description_en}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-purple-400">
                        €{item.price}
                        <span className="text-sm text-gray-400">/day</span>
                      </span>
                      <Link
                        href={`/equipment/${item.id}`}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="mt-20 glass-effect rounded-lg p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Interested in renting equipment?</h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Contact us via email or phone to discuss availability and pricing
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/book/equipment"
              className="inline-flex items-center justify-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded transition-all"
            >
              <Package className="mr-2" size={20} />
              Rent Equipment
            </Link>
            <Link
              href="mailto:info@stmevents.com"
              className="inline-flex items-center justify-center px-6 py-3 glass-effect hover:bg-white/10 rounded transition-all"
            >
              <Mail className="mr-2" size={20} />
              info@stmevents.com
            </Link>
            <Link
              href="tel:+1234567890"
              className="inline-flex items-center justify-center px-6 py-3 glass-effect hover:bg-white/10 rounded transition-all"
            >
              <Phone className="mr-2" size={20} />
              +123 456 7890
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
