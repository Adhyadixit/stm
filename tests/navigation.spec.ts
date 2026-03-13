import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  const pages = [
    { path: '/', name: 'Homepage' },
    { path: '/events', name: 'Events' },
    { path: '/gallery', name: 'Gallery' },
    { path: '/services', name: 'Services' },
    { path: '/equipment', name: 'Equipment' },
    { path: '/djs', name: 'DJs' },
    { path: '/about', name: 'About' },
    { path: '/contact', name: 'Contact' },
  ]

  for (const { path, name } of pages) {
    test(`should load ${name} page`, async ({ page }) => {
      await page.goto(path)
      await expect(page).toHaveURL(path)
      
      const navigation = page.locator('nav')
      await expect(navigation).toBeVisible()
    })
  }

  test('should have footer on all pages', async ({ page }) => {
    for (const { path } of pages) {
      await page.goto(path)
      const footer = page.locator('footer')
      await expect(footer).toBeVisible()
      await expect(footer.locator('h3')).toContainText('STM EVENTS')
    }
  })

  test('should navigate through all main pages', async ({ page }) => {
    await page.goto('/')
    
    await page.locator('nav').getByRole('link', { name: 'Events', exact: true }).click()
    await page.waitForURL('/events')
    await expect(page).toHaveURL('/events')
    
    await page.locator('nav').getByRole('link', { name: 'Gallery', exact: true }).click()
    await page.waitForURL('/gallery')
    await expect(page).toHaveURL('/gallery')
    
    await page.locator('nav').getByRole('link', { name: 'Services', exact: true }).click()
    await page.waitForURL('/services')
    await expect(page).toHaveURL('/services')
    
    await page.locator('nav').getByRole('link', { name: 'Equipment', exact: true }).click()
    await page.waitForURL('/equipment')
    await expect(page).toHaveURL('/equipment')
    
    await page.locator('nav').getByRole('link', { name: 'DJs', exact: true }).click()
    await page.waitForURL('/djs')
    await expect(page).toHaveURL('/djs')
    
    await page.locator('nav').getByRole('link', { name: 'About', exact: true }).click()
    await page.waitForURL('/about')
    await expect(page).toHaveURL('/about')
    
    await page.locator('nav').getByRole('link', { name: 'Contact', exact: true }).click()
    await page.waitForURL('/contact')
    await expect(page).toHaveURL('/contact')
  })
})
