import { test, expect } from '@playwright/test'

test.describe('Contact Page', () => {
  test('should display contact form', async ({ page }) => {
    await page.goto('/contact')
    
    await expect(page.getByRole('heading', { name: 'Contact Us' })).toBeVisible()
    await expect(page.getByLabel('Name *')).toBeVisible()
    await expect(page.getByLabel('Email *')).toBeVisible()
    await expect(page.getByLabel('Message *')).toBeVisible()
  })

  test('should submit contact form successfully', async ({ page }) => {
    await page.goto('/contact')
    
    await page.getByLabel('Name *').fill('Test User')
    await page.getByLabel('Email *').fill('test@example.com')
    await page.getByLabel('Phone').fill('+1234567890')
    await page.getByLabel('Inquiry Type').selectOption('general')
    await page.getByLabel('Message *').fill('This is a test message for the contact form.')
    
    await page.getByRole('button', { name: /Send Message/i }).click()
    
    await expect(page.getByText(/Thank you! Your message has been sent successfully/i)).toBeVisible({ timeout: 10000 })
  })

  test('should validate required fields', async ({ page }) => {
    await page.goto('/contact')
    
    await page.getByRole('button', { name: /Send Message/i }).click()
    
    const nameInput = page.getByLabel('Name *')
    await expect(nameInput).toBeFocused()
  })

  test('should display contact information', async ({ page }) => {
    await page.goto('/contact')
    
    await expect(page.getByText(/info@stmevents.com/i)).toBeVisible()
    await expect(page.getByText(/Office Hours/i)).toBeVisible()
  })
})
