import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('should display hero section with correct content', async ({ page }) => {
    await page.goto('/')
    
    await expect(page.locator('main h1')).toContainText('STM EVENTS')
    await expect(page.locator('main').getByText('Connecting Club Culture To The World')).toBeVisible()
    await expect(page.getByRole('link', { name: /Find an Event/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /Browse the Archive/i })).toBeVisible()
  })

  test('should navigate to events page', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: /Find an Event/i }).first().click()
    await page.waitForURL('/events')
    await expect(page).toHaveURL('/events')
  })

  test('should navigate to gallery page', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: /Browse the Archive/i }).first().click()
    await page.waitForURL('/gallery')
    await expect(page).toHaveURL('/gallery')
  })

  test('should have working navigation menu', async ({ page }) => {
    await page.goto('/')
    
    await page.locator('nav').getByRole('link', { name: 'Events', exact: true }).click()
    await page.waitForURL('/events')
    await expect(page).toHaveURL('/events')
    
    await page.goto('/')
    await page.locator('nav').getByRole('link', { name: 'Gallery', exact: true }).click()
    await page.waitForURL('/gallery')
    await expect(page).toHaveURL('/gallery')
    
    await page.goto('/')
    await page.locator('nav').getByRole('link', { name: 'Services', exact: true }).click()
    await page.waitForURL('/services')
    await expect(page).toHaveURL('/services')
  })

  test('should have responsive mobile menu', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    
    const menuButton = page.locator('nav button').first()
    await menuButton.click()
    
    await expect(page.locator('nav').getByRole('link', { name: 'Events', exact: true })).toBeVisible()
  })
})
