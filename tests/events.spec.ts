import { test, expect } from '@playwright/test'

test.describe('Events Page', () => {
  test('should display events page', async ({ page }) => {
    await page.goto('/events')
    
    await expect(page.locator('main h1')).toContainText('Events')
    await expect(page.getByText(/Upcoming shows and past sessions/i)).toBeVisible()
  })

  test('should show message when no events available', async ({ page }) => {
    await page.goto('/events')
    
    const noEventsMessage = page.getByText(/No events available/i)
    const upcomingSection = page.getByRole('heading', { name: 'Upcoming' })
    
    const hasEvents = await upcomingSection.isVisible().catch(() => false)
    if (!hasEvents) {
      await expect(noEventsMessage).toBeVisible()
    }
  })

  test('should navigate back to homepage', async ({ page }) => {
    await page.goto('/events')
    await page.getByRole('link', { name: 'STM EVENTS' }).click()
    await expect(page).toHaveURL('/')
  })
})
