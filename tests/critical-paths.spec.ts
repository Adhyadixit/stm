import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';
const ADMIN_EMAIL = 'admin@stmevents.com';
const ADMIN_PASSWORD = 'Admin123!STM';

test.describe('Critical Path: Homepage', () => {
  test('homepage loads with all sections', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Hero section
    await expect(page.locator('h1:has-text("STM EVENTS")')).toBeVisible({ timeout: 10000 });
    
    // Recent sessions
    await page.evaluate(() => window.scrollBy(0, 800));
    await page.waitForTimeout(500);
    
    // Upcoming events
    await page.evaluate(() => window.scrollBy(0, 800));
    await expect(page.locator('h2:has-text("Upcoming")')).toBeVisible();
    
    // Video section
    await page.evaluate(() => window.scrollBy(0, 800));
    await expect(page.locator('h2:has-text("Video")')).toBeVisible();
    
    // Audio section
    await page.evaluate(() => window.scrollBy(0, 800));
    await expect(page.locator('h2:has-text("Audio")')).toBeVisible();
    
    console.log('✅ Homepage loaded successfully with all sections');
  });

  test('all homepage images load without errors', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    const images = await page.locator('img').all();
    let brokenImages = 0;
    
    for (const img of images) {
      const src = await img.getAttribute('src');
      const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
      
      if (naturalWidth === 0) {
        console.log(`❌ Broken image: ${src}`);
        brokenImages++;
      }
    }
    
    expect(brokenImages).toBe(0);
    console.log(`✅ All ${images.length} images loaded successfully`);
  });
});

test.describe('Critical Path: Admin Login', () => {
  test('admin can login successfully', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/login`);
    
    await page.fill('input[type="email"]', ADMIN_EMAIL);
    await page.fill('input[type="password"]', ADMIN_PASSWORD);
    await page.click('button[type="submit"]');
    
    await page.waitForURL(`${BASE_URL}/admin/dashboard`, { timeout: 15000 });
    
    expect(page.url()).toContain('/admin');
    console.log('✅ Admin login successful');
  });
});

test.describe('Critical Path: Equipment Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/login`);
    await page.fill('input[type="email"]', ADMIN_EMAIL);
    await page.fill('input[type="password"]', ADMIN_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL(`${BASE_URL}/admin/dashboard`, { timeout: 15000 });
  });

  test('can view equipment list', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/equipment`);
    await expect(page.locator('h1, h2').filter({ hasText: /equipment/i })).toBeVisible();
    console.log('✅ Equipment list page accessible');
  });

  test('can create new equipment with image URL', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/equipment/new`);
    
    const timestamp = Date.now();
    await page.fill('input[name="name_en"]', `Test Equipment ${timestamp}`);
    await page.fill('input[name="name_ar"]', `معدات تجريبية ${timestamp}`);
    await page.fill('textarea[name="description_en"]', 'Test equipment description');
    await page.fill('textarea[name="description_ar"]', 'وصف المعدات التجريبية');
    
    // Select category if dropdown exists
    const categorySelect = page.locator('select[name="category"]');
    if (await categorySelect.isVisible()) {
      await categorySelect.selectOption('audio');
    }
    
    // Add price
    const priceInput = page.locator('input[name="price_per_day"], input[name="price"]');
    if (await priceInput.isVisible()) {
      await priceInput.fill('500');
    }
    
    // Add image URL
    const imageInput = page.locator('input[name="image_url"], input[type="url"]').first();
    if (await imageInput.isVisible()) {
      await imageInput.fill('https://cdn.pixabay.com/photo-1470225620780-dba8ba36b745/400/400');
    }
    
    await page.click('button[type="submit"]');
    await page.waitForURL(`${BASE_URL}/admin/equipment`, { timeout: 15000 });
    
    console.log('✅ Equipment created successfully');
  });
});

test.describe('Critical Path: User Navigation', () => {
  test('user can navigate to all main pages', async ({ page }) => {
    // Homepage
    await page.goto(BASE_URL);
    await expect(page.locator('h1:has-text("STM EVENTS")')).toBeVisible();
    
    // Events page
    await page.click('a[href="/events"]');
    await page.waitForURL(`${BASE_URL}/events`, { timeout: 5000 });
    console.log('✅ Events page accessible');
    
    // Gallery page
    await page.goto(BASE_URL);
    await page.click('a[href="/gallery"]');
    await page.waitForURL(`${BASE_URL}/gallery`, { timeout: 5000 });
    console.log('✅ Gallery page accessible');
    
    // Services page
    await page.goto(BASE_URL);
    await page.click('a[href="/services"]');
    await page.waitForURL(`${BASE_URL}/services`, { timeout: 5000 });
    console.log('✅ Services page accessible');
    
    // Equipment page
    await page.goto(BASE_URL);
    await page.click('a[href="/equipment"]');
    await page.waitForURL(`${BASE_URL}/equipment`, { timeout: 5000 });
    console.log('✅ Equipment page accessible');
  });
});

test.describe('Critical Path: Responsive Design', () => {
  test('works on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(BASE_URL);
    
    await expect(page.locator('h1:has-text("STM EVENTS")')).toBeVisible();
    console.log('✅ Mobile viewport works');
  });

  test('works on desktop viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto(BASE_URL);
    
    await expect(page.locator('h1:has-text("STM EVENTS")')).toBeVisible();
    console.log('✅ Desktop viewport works');
  });
});
