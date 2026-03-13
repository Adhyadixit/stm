'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useParams, useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  Star, 
  ShoppingCart, 
  Heart, 
  Share2, 
  Truck, 
  Shield, 
  Clock,
  Check,
  ChevronLeft,
  ChevronRight,
  Package,
  Calendar,
  Users,
  TrendingUp,
  Loader2,
  Phone,
  MapPin,
  X
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface EquipmentData {
  id: string
  name_en: string
  name_pl: string
  description_en: string
  description_pl: string
  category: string
  price: number
  is_available: boolean
  images: string[]
  specifications: Record<string, any>
  features: string[]
  reviews: Array<{
    id: string
    author: string
    rating: number
    comment: string
    date: string
    verified: boolean
  }>
  fomo_sections: Array<{
    id: string
    type: 'stock' | 'timer' | 'social_proof' | 'urgency'
    content: string
    enabled: boolean
  }>
}

export default function EquipmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [equipment, setEquipment] = useState<EquipmentData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [showCheckout, setShowCheckout] = useState(false)
  const [id, setId] = useState<string>('')

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params
      setId(resolvedParams.id)
    }
    getParams()
  }, [params])

  useEffect(() => {
    if (id) {
      loadEquipment()
    }
  }, [id])

  async function loadEquipment() {
    try {
      const { data, error } = await supabase
        .from('equipment')
        .select('*')
        .eq('id', id)
        .single()

      if (data) {
        // Add dummy images if no real images exist
        const dummyImages = [
          `https://picsum.photos/600/600?random=${data.id?.slice(0, 8) || 1}`,
          `https://picsum.photos/600/600?random=${data.id?.slice(0, 8) || 1}1`,
          `https://picsum.photos/600/600?random=${data.id?.slice(0, 8) || 1}2`,
          `https://picsum.photos/600/600?random=${data.id?.slice(0, 8) || 1}3`,
          `https://picsum.photos/600/600?random=${data.id?.slice(0, 8) || 1}4`
        ]
        
        const parsedData = {
          ...data,
          images: data.images && data.images.length > 0 ? data.images : dummyImages,
          specifications: data.specifications || {},
          features: data.features || [],
          reviews: data.reviews || [],
          fomo_sections: data.fomo_sections || [],
        }
        setEquipment(parsedData)
      } else if (error) {
        console.error('Error loading equipment:', error)
      }
    } catch (error) {
      console.error('Unexpected error:', error)
    } finally {
      setLoading(false)
    }
  }

  function renderStars(rating: number) {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'}
      />
    ))
  }

  function handleBookNow() {
    router.push(`/book/equipment?equipment=${equipment?.id}&quantity=${quantity}`)
  }

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center"><Loader2 className="animate-spin text-purple-400" size={48} /></div>
  if (!equipment) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Equipment not found</div>

  const averageRating = equipment.reviews.length > 0 
    ? equipment.reviews.reduce((sum, review) => sum + review.rating, 0) / equipment.reviews.length 
    : 0

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Breadcrumb Navigation */}
      <nav className="border-b border-white/10 bg-black/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/equipment" className="text-white hover:text-purple-400 transition-colors flex items-center gap-2">
            <ArrowLeft size={20} />
            Back to Equipment
          </Link>
          <div className="flex items-center gap-4">
            <button className="text-gray-400 hover:text-white transition-colors">
              <Heart size={20} />
            </button>
            <button className="text-gray-400 hover:text-white transition-colors">
              <Share2 size={20} />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section with Enhanced Gallery */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Enhanced Product Images Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-white/5 rounded-lg overflow-hidden relative">
              {equipment.images[selectedImage] ? (
                <>
                  <img
                    src={equipment.images[selectedImage]}
                    alt={equipment.name_en}
                    className="w-full h-full object-cover"
                  />
                  <button className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2 text-white text-sm hover:bg-black/70 transition-colors">
                    View Full Size
                  </button>
                  
                  {/* Arrow Navigation for Mobile */}
                  <div className="md:hidden absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/2 left-2 transform -translate-y-1/2 pointer-events-auto">
                      <button
                        onClick={() => setSelectedImage(Math.max(0, selectedImage - 1))}
                        className="bg-black/50 backdrop-blur-sm rounded-full p-2 text-white hover:bg-black/70 transition-colors"
                        disabled={selectedImage === 0}
                      >
                        <ChevronLeft size={20} />
                      </button>
                    </div>
                    <div className="absolute top-1/2 right-2 transform -translate-y-1/2 pointer-events-auto">
                      <button
                        onClick={() => setSelectedImage(Math.min(equipment.images.length - 1, selectedImage + 1))}
                        className="bg-black/50 backdrop-blur-sm rounded-full p-2 text-white hover:bg-black/70 transition-colors"
                        disabled={selectedImage === equipment.images.length - 1}
                      >
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <Package size={64} />
                </div>
              )}
            </div>
            
            {/* Thumbnail Gallery */}
            {equipment.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {equipment.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 hover:scale-105 ${
                      selectedImage === index 
                        ? 'border-purple-500 ring-2 ring-purple-500/50' 
                        : 'border-white/20 hover:border-white/40'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Product image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
            
            {/* Gallery Features */}
            <div className="flex items-center justify-between text-sm text-gray-400">
              <span>Image {selectedImage + 1} of {equipment.images.length || 1}</span>
              <div className="flex gap-4">
                <button className="hover:text-white transition-colors">Zoom</button>
                <button className="hover:text-white transition-colors">Fullscreen</button>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-purple-400 text-sm font-medium uppercase tracking-wide">
                  {equipment.category}
                </span>
                {equipment.is_available ? (
                  <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs">
                    Available
                  </span>
                ) : (
                  <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded-full text-xs">
                    Unavailable
                  </span>
                )}
              </div>
              
              <h1 className="text-4xl font-bold text-white mb-3">
                {equipment.name_en}
              </h1>
              <p className="text-xl text-gray-300 mb-4">
                Professional-grade equipment for unforgettable events
              </p>
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-gray-400 text-sm">
                  ({equipment.reviews?.length || 0} reviews)
                </span>
              </div>
            </div>

            <div className="text-4xl font-bold text-purple-400 mb-6">
              €{equipment.price}
              <span className="text-lg text-gray-400">/day</span>
            </div>

            {/* FOMO Sections */}
            {equipment.fomo_sections.filter(section => section.enabled).map(section => (
              <div key={section.id} className="glass-effect rounded-lg p-4 border border-purple-500/30">
                <div className="flex items-center gap-3">
                  {section.type === 'stock' && <TrendingUp className="text-purple-400" size={20} />}
                  {section.type === 'timer' && <Clock className="text-purple-400" size={20} />}
                  {section.type === 'social_proof' && <Users className="text-purple-400" size={20} />}
                  {section.type === 'urgency' && <Package className="text-purple-400" size={20} />}
                  <span className="text-white">{section.content}</span>
                </div>
              </div>
            ))}

            {/* Trust Signals */}
            <div className="space-y-4 mb-6">
              <h3 className="text-lg font-semibold text-white mb-3">Why Book With STM Events</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                    <Check className="text-green-400" size={20} />
                  </div>
                  <div>
                    <p className="text-white font-medium">Professional Equipment</p>
                    <p className="text-gray-400 text-sm">Industry-standard, tested, and maintained</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <Truck className="text-blue-400" size={20} />
                  </div>
                  <div>
                    <p className="text-white font-medium">Free Delivery & Setup</p>
                    <p className="text-gray-400 text-sm">We deliver and set up at your venue</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                    <Shield className="text-purple-400" size={20} />
                  </div>
                  <div>
                    <p className="text-white font-medium">Full Insurance Cover</p>
                    <p className="text-gray-400 text-sm">Equipment protected against damage</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center">
                    <Phone className="text-yellow-400" size={20} />
                  </div>
                  <div>
                    <p className="text-white font-medium">24/7 Technical Support</p>
                    <p className="text-gray-400 text-sm">Expert assistance during your event</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quantity and Booking */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="text-gray-400">Quantity:</label>
                <div className="flex items-center bg-white/10 border border-white/20 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 text-white hover:bg-white/10 transition-colors"
                  >
                    -
                  </button>
                  <span className="px-6 py-2 text-white font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 text-white hover:bg-white/10 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
              
              <button
                onClick={handleBookNow}
                disabled={!equipment.is_available}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-4 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                <ShoppingCart size={20} />
                {equipment.is_available ? 'Book Now' : 'Currently Unavailable'}
              </button>
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="glass-effect rounded-lg p-3">
                  <Truck className="text-purple-400 mx-auto mb-2" size={20} />
                  <span className="text-xs text-gray-400">Free Delivery</span>
                </div>
                <div className="glass-effect rounded-lg p-3">
                  <Shield className="text-purple-400 mx-auto mb-2" size={20} />
                  <span className="text-xs text-gray-400">Insurance</span>
                </div>
                <div className="glass-effect rounded-lg p-3">
                  <Clock className="text-purple-400 mx-auto mb-2" size={20} />
                  <span className="text-xs text-gray-400">24/7 Support</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      {equipment.features.length > 0 && (
        <section className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {equipment.features.map((feature, index) => (
              <div key={index} className="glass-effect rounded-lg p-6 border border-white/10">
                <Check className="text-purple-400 mb-3" size={24} />
                <h3 className="text-lg font-semibold text-white mb-2">{feature}</h3>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Description Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-bold text-white mb-6">Description</h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 leading-relaxed">
                {equipment.description_en}
              </p>
            </div>
          </div>
          
          {/* Specifications */}
          {Object.keys(equipment.specifications).length > 0 && (
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">Technical Specifications</h2>
              <div className="glass-effect rounded-lg p-6 border border-white/10">
                <dl className="space-y-4">
                  {Object.entries(equipment.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-3 border-b border-white/10 last:border-0">
                      <dt className="text-gray-400">{key}</dt>
                      <dd className="text-white font-medium">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Reviews Section */}
      {equipment.reviews.length > 0 && (
        <section className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Customer Reviews</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {equipment.reviews.map((review) => (
              <div key={review.id} className="glass-effect rounded-lg p-6 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-white font-semibold">{review.author}</h4>
                    <div className="flex items-center gap-1">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                  {review.verified && (
                    <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs">
                      Verified
                    </span>
                  )}
                </div>
                <p className="text-gray-300 mb-4">{review.comment}</p>
                <p className="text-gray-500 text-sm">{review.date}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Key Benefits Section - Inspired by SeekToLive */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Why Choose This Equipment</h2>
          <p className="text-gray-400 text-lg">Professional-grade features that elevate your events</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {[
            { icon: '🎯', title: 'Professional Grade', desc: 'Industry-standard quality' },
            { icon: '⚡', title: 'Plug & Play', desc: 'Easy setup and operation' },
            { icon: '🔧', title: 'Full Support', desc: 'Technical assistance included' },
            { icon: '📱', title: 'Modern Tech', desc: 'Latest equipment models' },
            { icon: '🎵', title: 'Premium Sound', desc: 'Crystal clear audio' },
            { icon: '💡', title: 'Smart Features', desc: 'Advanced capabilities' },
            { icon: '🛡️', title: 'Reliable', desc: 'Tested and maintained' },
            { icon: '🚀', title: 'High Performance', desc: 'Optimal output quality' }
          ].map((benefit, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl mb-4">{benefit.icon}</div>
              <h3 className="text-white font-semibold mb-2">{benefit.title}</h3>
              <p className="text-gray-400 text-sm">{benefit.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Brand Story Section - Inspired by SeekToLive */}
      <section className="bg-gradient-to-br from-purple-900/20 to-black py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">Equipment That Elevates Every Event</h2>
              <div className="space-y-4 text-gray-300">
                <p>At STM Events, we believe that great events deserve great equipment.</p>
                <p>That's why we've curated a collection of professional-grade audio, visual, and lighting equipment that transforms ordinary gatherings into extraordinary experiences.</p>
                <p>Each piece in our inventory is carefully selected, tested, and maintained to ensure it meets the high standards our clients expect.</p>
                <p>Whether you're hosting an intimate club night or a large-scale festival, our equipment delivers the performance and reliability you need.</p>
              </div>
              <div className="mt-8">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors"
                >
                  Learn About STM Events
                  <ChevronRight size={20} />
                </Link>
              </div>
            </div>
            <div className="aspect-square bg-white/5 rounded-lg overflow-hidden">
              <img
                src="https://picsum.photos/600/600?random=8"
                alt="Professional equipment setup"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Technical Excellence Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Technical Excellence</h2>
          <p className="text-gray-400 text-lg">Professional specifications for professional results</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: 'Sound Quality',
              desc: 'Crystal clear audio with minimal distortion',
              features: ['High-fidelity output', 'Wide frequency range', 'Low noise floor']
            },
            {
              title: 'Build Quality',
              desc: 'Durable construction for reliable performance',
              features: ['Metal chassis', 'Professional connectors', 'Road-tested durability']
            },
            {
              title: 'Ease of Use',
              desc: 'Intuitive controls for quick setup',
              features: ['Simple interface', 'Quick configuration', 'User-friendly design']
            }
          ].map((category, index) => (
            <div key={index} className="glass-effect rounded-lg p-6 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-3">{category.title}</h3>
              <p className="text-gray-400 mb-4">{category.desc}</p>
              <ul className="space-y-2">
                {category.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-2 text-gray-300">
                    <Check size={16} className="text-purple-400" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Social Proof Section - Inspired by SeekToLive */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Trusted by Event Professionals</h2>
          <p className="text-gray-400 text-lg">Join hundreds of successful events powered by our equipment</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              quote: "The equipment quality exceeded our expectations. Crystal clear sound and reliable performance throughout our 3-day festival.",
              author: "Alex Chen",
              role: "Festival Organizer",
              event: "Underground Music Festival 2025"
            },
            {
              quote: "Professional-grade gear that made our club night sound incredible. The setup was straightforward and the support was excellent.",
              author: "Maria Rodriguez",
              role: "Club Manager",
              event: "Weekly Techno Nights"
            },
            {
              quote: "We've rented equipment for multiple events and it's always been in perfect condition. Highly recommend for any professional event.",
              author: "James Wilson",
              role: "Event Producer",
              event: "Corporate Events & Conferences"
            }
          ].map((testimonial, index) => (
            <div key={index} className="glass-effect rounded-lg p-6 border border-white/10">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-300 mb-6 italic">"{testimonial.quote}"</p>
              <div>
                <p className="text-white font-semibold">{testimonial.author}</p>
                <p className="text-gray-400 text-sm">{testimonial.role}</p>
                <p className="text-purple-400 text-sm">{testimonial.event}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Frequently Asked Questions</h2>
          <p className="text-gray-400 text-lg">Everything you need to know about our equipment rental</p>
        </div>
        
        <div className="max-w-3xl mx-auto space-y-6">
          {[
            {
              question: "How far in advance should I book equipment?",
              answer: "We recommend booking at least 2-3 weeks in advance for popular items, especially during peak event seasons. However, we can often accommodate last-minute requests depending on availability."
            },
            {
              question: "Is delivery and setup included?",
              answer: "Yes, we offer delivery, setup, and pickup services for all our equipment. Our technical team will ensure everything is properly installed and tested before your event."
            },
            {
              question: "What if something breaks during my event?",
              answer: "We provide 24/7 technical support during your rental period. If any equipment fails, we'll either fix it on-site or replace it as quickly as possible."
            },
            {
              question: "Do you provide technical staff?",
              answer: "Yes, we can provide experienced technical staff to operate the equipment for your event. This is recommended for complex setups or when you want to focus on other aspects of your event."
            },
            {
              question: "What payment methods do you accept?",
              answer: "We accept all major credit cards, bank transfers, and can arrange corporate billing for regular clients. A 50% deposit is required to secure your booking."
            }
          ].map((faq, index) => (
            <div key={index} className="glass-effect rounded-lg p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-3">{faq.question}</h3>
              <p className="text-gray-300">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Related Equipment */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">Related Equipment</h2>
        <div className="text-center">
          <Link
            href="/equipment"
            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg transition-colors"
          >
            View All Equipment
            <ChevronRight size={20} />
          </Link>
        </div>
      </section>

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-black/90 border border-white/20 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">Complete Your Booking</h2>
                  <p className="text-gray-400 mt-1">{equipment.name_en}</p>
                </div>
                <button
                  onClick={() => setShowCheckout(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Booking Summary */}
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-3">Booking Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-gray-300">
                    <span>Equipment:</span>
                    <span>{equipment.name_en}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Quantity:</span>
                    <span>{quantity} x €{equipment.price}/day</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Duration:</span>
                    <span>To be confirmed</span>
                  </div>
                  <div className="border-t border-white/10 pt-2 mt-2">
                    <div className="flex justify-between text-white font-semibold">
                      <span>Subtotal:</span>
                      <span>€{equipment.price * quantity}/day</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Booking Form */}
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white mb-2">First Name *</label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div>
                    <label className="block text-white mb-2">Last Name *</label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                    placeholder="+48 123 456 789"
                  />
                </div>

                <div>
                  <label className="block text-white mb-2">Email Address *</label>
                  <input
                    type="email"
                    required
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-white mb-2">Event Date *</label>
                  <input
                    type="date"
                    required
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-white mb-2">Event Duration *</label>
                  <select
                    required
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="">Select duration</option>
                    <option value="1">1 Day</option>
                    <option value="2">2 Days</option>
                    <option value="3">3 Days</option>
                    <option value="weekend">Weekend (Fri-Sun)</option>
                    <option value="week">1 Week</option>
                    <option value="custom">Custom Duration</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white mb-2">Delivery Address *</label>
                  <textarea
                    required
                    rows={3}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                    placeholder="Enter the complete delivery address including venue name, street, city, and postal code"
                  />
                </div>

                <div>
                  <label className="block text-white mb-2">Special Requirements</label>
                  <textarea
                    rows={3}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                    placeholder="Any special setup requirements, access instructions, or other details we should know about"
                  />
                </div>
              </form>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-white/10">
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => setShowCheckout(false)}
                  className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors"
                >
                  Submit Booking Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
