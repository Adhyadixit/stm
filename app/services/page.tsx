import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { supabase } from '@/lib/supabase'

async function getServices() {
  const { data } = await supabase
    .from('services')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true })
  
  return data || []
}

export default async function ServicesPage() {
  const services = await getServices()

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold mb-4">Services</h1>
        <p className="text-xl text-gray-400 mb-16">Professional event production and DJ bookings</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <div
              key={service.id}
              className="group relative overflow-hidden rounded-lg glass-effect p-8 hover-lift"
            >
              {service.image_url && (
                <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity">
                  <img
                    src={service.image_url}
                    alt={service.title_en}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <div className="relative z-10">
                <div className="text-6xl font-bold text-purple-400/20 mb-4">
                  {String(index + 1).padStart(2, '0')}
                </div>
                <h2 className="text-3xl font-bold mb-4">{service.title_en}</h2>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  {service.description_en}
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center text-purple-400 hover:text-purple-300 group/link"
                >
                  Get in touch
                  <ArrowRight className="ml-2 group-hover/link:translate-x-1 transition-transform" size={20} />
                </Link>
              </div>
            </div>
          ))}
        </div>

        <section className="mt-20 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to work with us?</h2>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Contact us to discuss your event production needs or book our resident DJs
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded transition-all hover-lift"
          >
            Contact Us
            <ArrowRight className="ml-2" size={20} />
          </Link>
        </section>
      </div>
    </div>
  )
}
