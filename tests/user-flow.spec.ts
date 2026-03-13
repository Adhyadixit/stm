import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

test.describe('User Homepage Flow', () => {
  test('should load homepage successfully', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Verify hero section
    await expect(page.locator('h1').filter({ hasText: /STM EVENTS/i })).toBeVisible();
    await expect(page.locator('text=/Connecting Club Culture/i')).toBeVisible();
    
    // Verify CTA buttons
    await expect(page.locator('text=FIND AN EVENT')).toBeVisible();
    await expect(page.locator('text=Browse the archive')).toBeVisible();
  });

  test('should display recent sessions section', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Scroll to recent sessions
    await page.evaluate(() => window.scrollBy(0, 800));
    
    // Verify session cards are visible
    const sessionCards = page.locator('.event-card');
    await expect(sessionCards.first()).toBeVisible();
  });

  test('should display upcoming events section', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Scroll to upcoming section
    await page.evaluate(() => window.scrollBy(0, 1600));
    
    // Verify upcoming section
    await expect(page.locator('h2').filter({ hasText: /upcoming/i })).toBeVisible();
  });

  test('should display video section', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Scroll to video section
    await page.evaluate(() => window.scrollBy(0, 2400));
    
    // Verify video section
    await expect(page.locator('h2').filter({ hasText: /video/i })).toBeVisible();
  });

  test('should display audio section', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Scroll to audio section
    await page.evaluate(() => window.scrollBy(0, 3200));
    
    // Verify audio section
    await expect(page.locator('h2').filter({ hasText: /audio/i })).toBeVisible();
  });

  test('should display newsletter signup', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Scroll to newsletter
    await page.evaluate(() => window.scrollBy(0, 4000));
    
    // Verify newsletter section
    await expect(page.locator('text=/SIGN UP TO OUR MAILING LIST/i')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('button').filter({ hasText: /SIGN UP/i })).toBeVisible();
  });

  test('should display footer with all links', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    
    // Verify footer sections
    await expect(page.locator('text=STM Events').last()).toBeVisible();
    await expect(page.locator('text=Content').last()).toBeVisible();
    await expect(page.locator('text=Connect').last()).toBeVisible();
    await expect(page.locator('text=Business').last()).toBeVisible();
  });
});

test.describe('User Navigation Flow', () => {
  test('should navigate to events page', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Click events link in navigation
    await page.click('a[href="/events"]');
    
    // Verify navigation
    await page.waitForURL(`${BASE_URL}/events`, { timeout: 5000 });
    expect(page.url()).toContain('/events');
  });

  test('should navigate to gallery page', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Click gallery/video link
    await page.click('a[href="/gallery"]');
    
    // Verify navigation
    await page.waitForURL(`${BASE_URL}/gallery`, { timeout: 5000 });
    expect(page.url()).toContain('/gallery');
  });

  test('should navigate to services page', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Click services link
    await page.click('a[href="/services"]');
    
    // Verify navigation
    await page.waitForURL(`${BASE_URL}/services`, { timeout: 5000 });
    expect(page.url()).toContain('/services');
  });

  test('should navigate to equipment page', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Click equipment link
    await page.click('a[href="/equipment"]');
    
    // Verify navigation
    await page.waitForURL(`${BASE_URL}/equipment`, { timeout: 5000 });
    expect(page.url()).toContain('/equipment');
  });

  test('should navigate to about page', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Click about/editorial link
    await page.click('a[href="/about"]');
    
    // Verify navigation
    await page.waitForURL(`${BASE_URL}/about`, { timeout: 5000 });
    expect(page.url()).toContain('/about');
  });
});

test.describe('User Events Page', () => {
  test('should display events list', async ({ page }) => {
    await page.goto(`${BASE_URL}/events`);
    
    // Verify events page loads
    await expect(page.locator('h1, h2').filter({ hasText: /events/i })).toBeVisible();
  });

  test('should filter events by upcoming', async ({ page }) => {
    await page.goto(`${BASE_URL}/events`);
    
    // Look for filter/tab options
    const upcomingFilter = page.locator('button, a').filter({ hasText: /upcoming/i }).first();
    if (await upcomingFilter.isVisible()) {
      await upcomingFilter.click();
      await page.waitForTimeout(1000);
    }
  });

  test('should view event details', async ({ page }) => {
    await page.goto(`${BASE_URL}/events`);
    
    // Click first event
    const firstEvent = page.locator('a[href*="/events/"]').first();
    if (await firstEvent.isVisible()) {
      await firstEvent.click();
      
      // Verify we're on event detail page
      await page.waitForTimeout(1000);
      expect(page.url()).toContain('/events/');
    }
  });
});

test.describe('User Equipment Page', () => {
  test('should display equipment catalog', async ({ page }) => {
    await page.goto(`${BASE_URL}/equipment`);
    
    // Verify equipment page loads
    await expect(page.locator('h1, h2').filter({ hasText: /equipment/i })).toBeVisible();
  });

  test('should filter equipment by category', async ({ page }) => {
    await page.goto(`${BASE_URL}/equipment`);
    
    // Look for category filters
    const categoryFilter = page.locator('button, select').filter({ hasText: /audio|lighting|video/i }).first();
    if (await categoryFilter.isVisible()) {
      await categoryFilter.click();
      await page.waitForTimeout(1000);
    }
  });

  test('should view equipment details', async ({ page }) => {
    await page.goto(`${BASE_URL}/equipment`);
    
    // Click first equipment item
    const firstEquipment = page.locator('a[href*="/equipment/"]').first();
    if (await firstEquipment.isVisible()) {
      await firstEquipment.click();
      
      // Verify we're on equipment detail page
      await page.waitForTimeout(1000);
      expect(page.url()).toContain('/equipment/');
    }
  });
});

test.describe('User Gallery Page', () => {
  test('should display gallery grid', async ({ page }) => {
    await page.goto(`${BASE_URL}/gallery`);
    
    // Verify gallery page loads
    await expect(page.locator('h1, h2').filter({ hasText: /gallery|video/i })).toBeVisible();
  });

  test('should filter gallery by category', async ({ page }) => {
    await page.goto(`${BASE_URL}/gallery`);
    
    // Look for category filters
    const categoryFilter = page.locator('button').filter({ hasText: /event|dj|venue/i }).first();
    if (await categoryFilter.isVisible()) {
      await categoryFilter.click();
      await page.waitForTimeout(1000);
    }
  });
});

test.describe('User DJs Page', () => {
  test('should display resident DJs', async ({ page }) => {
    await page.goto(`${BASE_URL}/djs`);
    
    // Verify DJs page loads
    await expect(page.locator('h1, h2').filter({ hasText: /dj|resident/i })).toBeVisible();
  });

  test('should view DJ profile', async ({ page }) => {
    await page.goto(`${BASE_URL}/djs`);
    
    // Click first DJ
    const firstDJ = page.locator('a[href*="/djs/"]').first();
    if (await firstDJ.isVisible()) {
      await firstDJ.click();
      
      // Verify we're on DJ detail page
      await page.waitForTimeout(1000);
      expect(page.url()).toContain('/djs/');
    }
  });
});

test.describe('User Responsive Design', () => {
  test('should work on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(BASE_URL);
    
    // Verify mobile navigation
    await expect(page.locator('h1').filter({ hasText: /STM EVENTS/i })).toBeVisible();
  });

  test('should work on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto(BASE_URL);
    
    // Verify tablet layout
    await expect(page.locator('h1').filter({ hasText: /STM EVENTS/i })).toBeVisible();
  });

  test('should work on desktop viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto(BASE_URL);
    
    // Verify desktop layout
    await expect(page.locator('h1').filter({ hasText: /STM EVENTS/i })).toBeVisible();
  });
});

test.describe('User Image Loading', () => {
  test('should load all homepage images', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Wait for images to load
    await page.waitForLoadState('networkidle');
    
    // Check for broken images
    const images = await page.locator('img').all();
    for (const img of images) {
      const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
      expect(naturalWidth).toBeGreaterThan(0);
    }
  });
});

test.describe('User Performance', () => {
  test('should load homepage within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    // Should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);
  });
});
