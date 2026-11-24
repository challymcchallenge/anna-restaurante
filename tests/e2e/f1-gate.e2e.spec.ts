import { expect, test, type Page } from '@playwright/test'
import fs from 'fs'
import os from 'os'
import path from 'path'
import sharp from 'sharp'

import { login } from '../helpers/login'
import { cleanupTestUser, seedTestEditor, seedTestUser, testEditor, testUser } from '../helpers/seedUser'

/**
 * GATE 1 (docs/PLAN.md): Administratorul adaugă din panou o fotografie, o seară și un vin;
 * Editorul de probă nu poate deschide Premii și Setări.
 */
const BASE = 'http://localhost:3000'

test.describe.configure({ mode: 'serial' })

test.describe('GATE 1', () => {
  let photo: string

  test.beforeAll(async () => {
    await seedTestUser()
    await seedTestEditor()
    // O fotografie „din telefon”: 4032 × 3024 px, mai mare decât limita de 2560 px.
    photo = path.join(os.tmpdir(), `gate1-${Date.now()}.jpg`)
    await sharp({ create: { width: 4032, height: 3024, channels: 3, background: '#7a1f1f' } })
      .jpeg({ quality: 95 })
      .toFile(photo)
  })

  test.afterAll(async () => {
    await cleanupTestUser()
    fs.rmSync(photo, { force: true })
  })

  async function selectFirstTenant(page: Page) {
    const { docs } = await (await page.request.get(`${BASE}/api/tenants?sort=_order&limit=1`)).json()
    await page.context().addCookies([{ name: 'payload-tenant', value: String(docs[0].id), url: BASE }])
  }

  test('Administratorul încarcă o fotografie: convertită în browser, variante AVIF/WebP pe server', async ({ page }) => {
    await login({ page, user: testUser })
    await selectFirstTenant(page)
    await page.goto(`${BASE}/admin/collections/media/create`)
    await page.setInputFiles('.media-convert input[type=file]', photo)
    await expect(page.locator('.file-field__filename')).toHaveValue(/\.jpg$/, { timeout: 60_000 })
    await page.fill('#field-alt', 'Fotografie de probă GATE 1')
    await page.click('#action-save')
    await page.waitForURL(/\/admin\/collections\/media\/\d+/, { timeout: 120_000 })
    const id = page.url().split('/').pop()
    const doc = await (await page.request.get(`${BASE}/api/media/${id}?depth=0`)).json()
    expect(Math.max(doc.width, doc.height)).toBeLessThanOrEqual(2560)
    expect(doc.originalBytes).toBeGreaterThan(doc.filesize)
    expect(doc.sizes.avif640.mimeType).toBe('image/avif')
    expect(doc.sizes.webp1280.mimeType).toBe('image/webp')
    await page.request.delete(`${BASE}/api/media/${id}`)
  })

  test('Administratorul adaugă o seară și un vin din panou', async ({ page }) => {
    await login({ page, user: testUser })
    await selectFirstTenant(page)

    await page.goto(`${BASE}/admin/collections/events/create`)
    await page.fill('#field-name', 'Seară de probă GATE 1')
    const date = new Date(Date.now() + 14 * 86_400_000)
    const dd = String(date.getDate()).padStart(2, '0')
    const mm = String(date.getMonth() + 1).padStart(2, '0')
    await page.locator('#field-startsAt input').fill(`${dd}.${mm}.${date.getFullYear()} 20:00`)
    await page.keyboard.press('Escape')
    await page.locator('#field-placeholder').check()
    await page.click('#action-save')
    await page.waitForURL(/\/admin\/collections\/events\/\d+/, { timeout: 60_000 })
    const eventId = page.url().split('/').pop()

    await page.goto(`${BASE}/admin/collections/wines/create`)
    await page.fill('#field-name', 'Vin de probă GATE 1')
    await page.locator('#field-type .rs__control').click()
    await page.locator('.rs__option', { hasText: 'Roșu' }).first().click()
    await page.fill('#field-priceBottle', '120')
    await page.click('#action-save')
    await page.waitForURL(/\/admin\/collections\/wines\/\d+/, { timeout: 60_000 })
    const wineId = page.url().split('/').pop()

    await page.request.delete(`${BASE}/api/events/${eventId}`)
    await page.request.delete(`${BASE}/api/wines/${wineId}`)
  })

  test('Editorul nu vede și nu poate deschide Premii și Setări', async ({ page }) => {
    await login({ page, user: testEditor })
    const nav = page.locator('nav')
    await expect(nav.getByText('Seri tematice')).toBeVisible()
    await expect(nav.getByText('Premii și distincții')).toHaveCount(0)
    await expect(nav.getByText('Setări restaurant')).toHaveCount(0)
    for (const slug of ['awards', 'settings']) {
      await page.goto(`${BASE}/admin/collections/${slug}`)
      await expect(page.getByText('Nimic găsit')).toBeVisible()
      expect((await page.request.get(`${BASE}/api/${slug}`)).status()).toBe(403)
    }
  })
})
