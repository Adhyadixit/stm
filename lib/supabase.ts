import { createClient as createSupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  }
})

// Check if user is admin
export async function isAdmin(): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false
  
  const { data } = await supabase
    .from('admin_users')
    .select('id')
    .eq('user_id', user.id)
    .single()
  
  return !!data
}

// Get current user
export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export type Event = {
  id: string
  title_en: string
  title_de: string
  slug: string
  description_en: string | null
  description_de: string | null
  event_date: string
  location: string
  venue: string | null
  lineup: any[]
  eventbrite_url: string | null
  featured_image: string | null
  images: any[]
  videos: any[]
  is_published: boolean
  created_at: string
  updated_at: string
}

export type GalleryItem = {
  id: string
  title_en: string
  title_de: string
  description_en: string | null
  description_de: string | null
  media_type: 'image' | 'video' | 'aftermovie' | 'dj_set'
  media_url: string
  thumbnail_url: string | null
  event_id: string | null
  display_order: number
  is_published: boolean
  created_at: string
  updated_at: string
}

export type Equipment = {
  id: string
  name_en: string
  name_de: string
  description_en: string | null
  description_de: string | null
  category: 'sound' | 'dj' | 'lighting'
  price: number
  currency: string
  images: any[]
  specifications: any
  is_available: boolean
  display_order: number
  created_at: string
  updated_at: string
}

export type ResidentDJ = {
  id: string
  name: string
  bio_en: string | null
  bio_de: string | null
  photo_url: string | null
  logo_url: string | null
  social_links: any
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export type Service = {
  id: string
  title_en: string
  title_de: string
  description_en: string | null
  description_de: string | null
  icon: string | null
  image_url: string | null
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export type ContentPage = {
  id: string
  page_key: string
  title_en: string
  title_de: string
  content_en: string | null
  content_de: string | null
  meta_description_en: string | null
  meta_description_de: string | null
  updated_at: string
}
