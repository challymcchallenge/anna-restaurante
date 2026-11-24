import { expect, test } from '@playwright/test'

test.describe('Site public (în construcție)', () => {
  test('pagina principală răspunde și nu se indexează (ADR-012)', async ({ page }) => {
    const response = await page.goto('http://localhost:3000')
    expect(response?.status()).toBe(200)
    expect(response?.headers()['x-robots-tag']).toContain('noindex')
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/)
  })
})
