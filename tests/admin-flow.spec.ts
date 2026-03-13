import { test, expect } from '@playwright/test';

const ADMIN_EMAIL = 'admin@stmevents.com';
const ADMIN_PASSWORD = 'Admin123!STM';
const BASE_URL = 'http://localhost:3000';

test.describe('Admin Authentication Flow', () => {
  test('should login as admin successfully', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/login`);
    
    // Fill login form
    await page.fill('input[type="email"]', ADMIN_EMAIL);
    await page.fill('input[type="password"]', ADMIN_PASSWORD);
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Wait for redirect to admin dashboard
    await page.waitForURL(`${BASE_URL}/admin`, { timeout: 10000 });
    
    // Verify we're on admin dashboard
    expect(page.url()).toContain('/admin');
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/login`);
    
    await page.fill('input[type="email"]', 'wrong@email.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    
    // Should show error message
    await expect(page.locator('text=/invalid|error|incorrect/i')).toBeVisible({ timeout: 5000 });
  });
});

test.describe('Admin Equipment Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto(`${BASE_URL}/admin/login`);
    await page.fill('input[type="email"]', ADMIN_EMAIL);
    await page.fill('input[type="password"]', ADMIN_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL(`${BASE_URL}/admin`, { timeout: 10000 });
  });

  test('should navigate to equipment page', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/equipment`);
    await expect(page.locator('h1, h2').filter({ hasText: /equipment/i })).toBeVisible();
  });

  test('should create new equipment with image URL', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/equipment/new`);
    
    // Fill equipment form
    await page.fill('input[name="name_en"]', 'Test Speaker System');
    await page.fill('input[name="name_ar"]', 'نظام مكبرات الصوت');
    await page.fill('textarea[name="description_en"]', 'High-quality professional speaker system for events');
    await page.fill('textarea[name="description_ar"]', 'نظام مكبرات صوت احترافي عالي الجودة للفعاليات');
    
    // Select category
    await page.selectOption('select[name="category"]', 'audio');
    
    // Add price and availability
    await page.fill('input[name="price_per_day"]', '500');
    await page.check('input[name="is_available"]');
    
    // Add image URL
    await page.fill('input[name="image_url"]', 'https://cdn.pixabay.com/photo-1470225620780-dba8ba36b745/400/400');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Wait for redirect back to equipment list
    await page.waitForURL(`${BASE_URL}/admin/equipment`, { timeout: 10000 });
    
    // Verify equipment appears in list
    await expect(page.locator('text=Test Speaker System')).toBeVisible();
  });

  test('should edit existing equipment', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/equipment`);
    
    // Click first edit button
    const editButton = page.locator('a, button').filter({ hasText: /edit/i }).first();
    await editButton.click();
    
    // Update name
    await page.fill('input[name="name_en"]', 'Updated Equipment Name');
    
    // Submit
    await page.click('button[type="submit"]');
    
    // Verify update
    await page.waitForURL(`${BASE_URL}/admin/equipment`, { timeout: 10000 });
    await expect(page.locator('text=Updated Equipment Name')).toBeVisible();
  });

  test('should delete equipment', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/equipment`);
    
    // Get equipment name before deletion
    const firstEquipment = page.locator('[data-testid="equipment-item"]').first();
    const equipmentName = await firstEquipment.locator('h3, h2').textContent();
    
    // Click delete button
    const deleteButton = firstEquipment.locator('button').filter({ hasText: /delete/i });
    await deleteButton.click();
    
    // Confirm deletion if there's a confirmation dialog
    page.on('dialog', dialog => dialog.accept());
    
    // Verify equipment is removed
    await expect(page.locator(`text=${equipmentName}`)).not.toBeVisible({ timeout: 5000 });
  });
});

test.describe('Admin Events Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/login`);
    await page.fill('input[type="email"]', ADMIN_EMAIL);
    await page.fill('input[type="password"]', ADMIN_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL(`${BASE_URL}/admin`, { timeout: 10000 });
  });

  test('should create new event', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/events/new`);
    
    // Fill event form
    await page.fill('input[name="title_en"]', 'Test Event 2026');
    await page.fill('input[name="title_ar"]', 'حدث تجريبي 2026');
    await page.fill('textarea[name="description_en"]', 'This is a test event for 2026');
    await page.fill('textarea[name="description_ar"]', 'هذا حدث تجريبي لعام 2026');
    
    // Set date and location
    await page.fill('input[name="event_date"]', '2026-06-15T20:00');
    await page.fill('input[name="location"]', 'Dubai, UAE');
    await page.fill('input[name="venue"]', 'Test Venue');
    
    // Set capacity and price
    await page.fill('input[name="capacity"]', '500');
    await page.fill('input[name="ticket_price"]', '150');
    
    // Publish event
    await page.check('input[name="is_published"]');
    
    // Submit
    await page.click('button[type="submit"]');
    
    // Verify redirect
    await page.waitForURL(`${BASE_URL}/admin/events`, { timeout: 10000 });
    await expect(page.locator('text=Test Event 2026')).toBeVisible();
  });

  test('should list all events', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/events`);
    
    // Verify events page loads
    await expect(page.locator('h1, h2').filter({ hasText: /events/i })).toBeVisible();
  });
});

test.describe('Admin Gallery Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/login`);
    await page.fill('input[type="email"]', ADMIN_EMAIL);
    await page.fill('input[type="password"]', ADMIN_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL(`${BASE_URL}/admin`, { timeout: 10000 });
  });

  test('should navigate to gallery page', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/gallery`);
    await expect(page.locator('h1, h2').filter({ hasText: /gallery/i })).toBeVisible();
  });

  test('should add new gallery item with image URL', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/gallery/new`);
    
    // Fill gallery form
    await page.fill('input[name="title_en"]', 'Test Gallery Image');
    await page.fill('input[name="title_ar"]', 'صورة معرض تجريبية');
    await page.fill('textarea[name="description_en"]', 'Test gallery description');
    
    // Add image URL
    await page.fill('input[name="image_url"]', 'https://cdn.pixabay.com/photo-1516450360212-3a3b1d4c8c4c/800/600');
    
    // Select category
    await page.selectOption('select[name="category"]', 'event');
    
    // Submit
    await page.click('button[type="submit"]');
    
    // Verify redirect
    await page.waitForURL(`${BASE_URL}/admin/gallery`, { timeout: 10000 });
  });
});

test.describe('Admin DJ Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/login`);
    await page.fill('input[type="email"]', ADMIN_EMAIL);
    await page.fill('input[type="password"]', ADMIN_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL(`${BASE_URL}/admin`, { timeout: 10000 });
  });

  test('should navigate to DJs page', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/djs`);
    await expect(page.locator('h1, h2').filter({ hasText: /dj/i })).toBeVisible();
  });

  test('should create new DJ profile', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/djs/new`);
    
    // Fill DJ form
    await page.fill('input[name="name"]', 'DJ Test');
    await page.fill('textarea[name="bio_en"]', 'Professional DJ with 10 years experience');
    await page.fill('textarea[name="bio_ar"]', 'دي جي محترف مع 10 سنوات خبرة');
    
    // Add genres
    await page.fill('input[name="genres"]', 'Techno, House, Electronic');
    
    // Add social links
    await page.fill('input[name="instagram"]', 'https://instagram.com/djtest');
    await page.fill('input[name="soundcloud"]', 'https://soundcloud.com/djtest');
    
    // Add image URL
    await page.fill('input[name="image_url"]', 'https://cdn.pixabay.com/photo-1493225457124-a3eb161ffa5f/400/400');
    
    // Set as resident
    await page.check('input[name="is_resident"]');
    
    // Submit
    await page.click('button[type="submit"]');
    
    // Verify redirect
    await page.waitForURL(`${BASE_URL}/admin/djs`, { timeout: 10000 });
    await expect(page.locator('text=DJ Test')).toBeVisible();
  });
});

test.describe('Admin Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/login`);
    await page.fill('input[type="email"]', ADMIN_EMAIL);
    await page.fill('input[type="password"]', ADMIN_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL(`${BASE_URL}/admin`, { timeout: 10000 });
  });

  test('should display admin dashboard with navigation', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin`);
    
    // Verify dashboard elements
    await expect(page.locator('text=/dashboard|admin/i')).toBeVisible();
    
    // Verify navigation links exist
    await expect(page.locator('a[href*="/admin/events"]')).toBeVisible();
    await expect(page.locator('a[href*="/admin/equipment"]')).toBeVisible();
    await expect(page.locator('a[href*="/admin/gallery"]')).toBeVisible();
    await expect(page.locator('a[href*="/admin/djs"]')).toBeVisible();
  });

  test('should logout successfully', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin`);
    
    // Click logout button
    const logoutButton = page.locator('button, a').filter({ hasText: /logout|sign out/i });
    await logoutButton.click();
    
    // Verify redirect to login page
    await page.waitForURL(`${BASE_URL}/admin/login`, { timeout: 10000 });
  });
});
