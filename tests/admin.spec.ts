import { test, expect } from '@playwright/test'
import { supabase } from '../lib/supabase'

const ADMIN_EMAIL = 'admin@stmevents.com'
const ADMIN_PASSWORD = 'TestAdmin123!'

test.describe('Admin Authentication', () => {
  test.beforeAll(async () => {
    // Create admin user for testing
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    })

    if (!signUpError && authData.user) {
      // Add to admin_users table
      await supabase.from('admin_users').insert({
        user_id: authData.user.id,
        email: ADMIN_EMAIL,
      })
    }
  })

  test('should show login page', async ({ page }) => {
    await page.goto('/admin/login')
    
    await expect(page.getByRole('heading', { name: 'STM EVENTS' })).toBeVisible()
    await expect(page.getByText('Admin Login')).toBeVisible()
    await expect(page.getByLabel('Email')).toBeVisible()
    await expect(page.getByLabel('Password')).toBeVisible()
  })

  test('should login successfully with admin credentials', async ({ page }) => {
    await page.goto('/admin/login')
    
    await page.getByLabel('Email').fill(ADMIN_EMAIL)
    await page.getByLabel('Password').fill(ADMIN_PASSWORD)
    await page.getByRole('button', { name: /Sign In/i }).click()
    
    await page.waitForURL('/admin/dashboard')
    await expect(page).toHaveURL('/admin/dashboard')
    await expect(page.getByText('STM EVENTS ADMIN')).toBeVisible()
  })

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/admin/login')
    
    await page.getByLabel('Email').fill('wrong@example.com')
    await page.getByLabel('Password').fill('wrongpassword')
    await page.getByRole('button', { name: /Sign In/i }).click()
    
    await expect(page.getByText(/Invalid/i)).toBeVisible()
  })
})

test.describe('Admin Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/admin/login')
    await page.getByLabel('Email').fill(ADMIN_EMAIL)
    await page.getByLabel('Password').fill(ADMIN_PASSWORD)
    await page.getByRole('button', { name: /Sign In/i }).click()
    await page.waitForURL('/admin/dashboard')
  })

  test('should display dashboard with statistics', async ({ page }) => {
    await expect(page.getByText('Dashboard')).toBeVisible()
    await expect(page.getByText('Events')).toBeVisible()
    await expect(page.getByText('Gallery Items')).toBeVisible()
    await expect(page.getByText('Equipment')).toBeVisible()
    await expect(page.getByText('DJs')).toBeVisible()
  })

  test('should navigate to events management', async ({ page }) => {
    await page.getByRole('link', { name: /Manage Events/i }).click()
    await page.waitForURL('/admin/events')
    await expect(page).toHaveURL('/admin/events')
    await expect(page.getByRole('heading', { name: 'Events' })).toBeVisible()
  })

  test('should navigate to gallery management', async ({ page }) => {
    await page.getByRole('link', { name: /Manage Gallery/i }).click()
    await page.waitForURL('/admin/gallery')
    await expect(page).toHaveURL('/admin/gallery')
  })

  test('should navigate to equipment management', async ({ page }) => {
    await page.getByRole('link', { name: /Manage Equipment/i }).click()
    await page.waitForURL('/admin/equipment')
    await expect(page).toHaveURL('/admin/equipment')
  })

  test('should navigate to DJs management', async ({ page }) => {
    await page.getByRole('link', { name: /Manage DJs/i }).click()
    await page.waitForURL('/admin/djs')
    await expect(page).toHaveURL('/admin/djs')
  })
})

test.describe('Admin Events CRUD', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin/login')
    await page.getByLabel('Email').fill(ADMIN_EMAIL)
    await page.getByLabel('Password').fill(ADMIN_PASSWORD)
    await page.getByRole('button', { name: /Sign In/i }).click()
    await page.waitForURL('/admin/dashboard')
    await page.goto('/admin/events')
  })

  test('should create a new event', async ({ page }) => {
    await page.getByRole('link', { name: /Add Event/i }).click()
    await page.waitForURL('/admin/events/new')
    
    await page.getByLabel('Title (English) *').fill('Test Event')
    await page.getByLabel('Title (German)').fill('Test Veranstaltung')
    await page.getByLabel('Slug *').fill('test-event')
    await page.getByLabel('Description (English)').fill('This is a test event')
    await page.getByLabel('Event Date *').fill('2026-12-31T20:00')
    await page.getByLabel('Location *').fill('Berlin')
    await page.getByLabel('Venue').fill('Test Venue')
    await page.getByLabel('Lineup (comma-separated)').fill('DJ Test, MC Test')
    await page.getByLabel('Publish immediately').check()
    
    await page.getByRole('button', { name: /Create Event/i }).click()
    
    await page.waitForURL('/admin/events')
    await expect(page.getByText('Test Event')).toBeVisible()
  })

  test('should display events list', async ({ page }) => {
    await expect(page.getByRole('table')).toBeVisible()
    await expect(page.getByText('Title')).toBeVisible()
    await expect(page.getByText('Date')).toBeVisible()
    await expect(page.getByText('Location')).toBeVisible()
    await expect(page.getByText('Status')).toBeVisible()
  })

  test('should validate required fields', async ({ page }) => {
    await page.getByRole('link', { name: /Add Event/i }).click()
    await page.waitForURL('/admin/events/new')
    
    await page.getByRole('button', { name: /Create Event/i }).click()
    
    // Form should not submit without required fields
    await expect(page).toHaveURL('/admin/events/new')
  })
})

test.describe('Database Integration', () => {
  test('should verify all tables exist and are accessible', async () => {
    const tables = ['events', 'gallery', 'equipment', 'resident_djs', 'services', 'content_pages', 'contact_submissions', 'admin_users']
    
    for (const table of tables) {
      const { error } = await supabase.from(table).select('id').limit(1)
      expect(error).toBeNull()
    }
  })

  test('should verify RLS policies are working', async () => {
    // Unauthenticated user should only see published events
    const { data: publicEvents } = await supabase
      .from('events')
      .select('*')
    
    expect(publicEvents).toBeDefined()
    expect(publicEvents?.every(e => e.is_published)).toBe(true)
  })

  test('should create and retrieve event from database', async () => {
    // Login first
    await supabase.auth.signInWithPassword({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    })

    const testEvent = {
      title_en: 'DB Test Event',
      title_de: 'DB Test Veranstaltung',
      slug: 'db-test-event-' + Date.now(),
      description_en: 'Test description',
      event_date: '2026-12-31T20:00:00+00:00',
      location: 'Test City',
      venue: 'Test Venue',
      lineup: ['DJ 1', 'DJ 2'],
      is_published: true,
    }

    const { data: created, error: createError } = await supabase
      .from('events')
      .insert(testEvent)
      .select()
      .single()

    expect(createError).toBeNull()
    expect(created).toBeDefined()
    expect(created?.title_en).toBe(testEvent.title_en)

    // Cleanup
    if (created) {
      await supabase.from('events').delete().eq('id', created.id)
    }

    await supabase.auth.signOut()
  })
})
