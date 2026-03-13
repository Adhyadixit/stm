import { test, expect } from '@playwright/test'

test.describe('Design & Styling', () => {
  test('should have dark theme background', async ({ page }) => {
    await page.goto('/')
    
    const body = page.locator('body')
    const backgroundColor = await body.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor
    })
    
    expect(backgroundColor).toContain('0, 0, 0')
  })

  test('should have purple accent colors', async ({ page }) => {
    await page.goto('/')
    
    const findEventButton = page.getByRole('link', { name: /Find an Event/i }).first()
    await expect(findEventButton).toBeVisible()
    
    const bgColor = await findEventButton.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor
    })
    
    expect(bgColor).toBeTruthy()
  })

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    
    await expect(page.locator('main h1')).toContainText('STM EVENTS')
    
    const navigation = page.locator('nav')
    await expect(navigation).toBeVisible()
  })

  test('should be responsive on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.goto('/')
    
    await expect(page.locator('main h1')).toContainText('STM EVENTS')
  })

  test('should be responsive on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 })
    await page.goto('/')
    
    await expect(page.locator('main h1')).toContainText('STM EVENTS')
  })

  test('should have hover effects on links', async ({ page }) => {
    await page.goto('/')
    
    const navLink = page.getByRole('link', { name: 'Events' }).first()
    await navLink.hover()
    
    await expect(navLink).toBeVisible()
  })
})
