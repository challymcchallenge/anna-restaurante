import { expect, test, type Page } from '@playwright/test'

import { login } from '../helpers/login'
import { cleanupTestUser, seedTestUser, testUser } from '../helpers/seedUser'

test.describe('Panou (Administrator)', () => {
  let page: Page

  test.beforeAll(async ({ browser }) => {
    await seedTestUser()
    page = await (await browser.newContext()).newPage()
    await login({ page, user: testUser })
  })

  test.afterAll(async () => {
    await cleanupTestUser()
  })

  test('tabloul de bord arată contorul de conținut provizoriu', async () => {
    await page.goto('http://localhost:3000/admin')
    await expect(page.getByTestId('placeholder-total')).toHaveText(/^\d+$/)
  })

  test('lista de utilizatori se deschide, în română', async () => {
    await page.goto('http://localhost:3000/admin/collections/users')
    await expect(page.locator('h1', { hasText: 'Utilizatori' }).first()).toBeVisible()
  })

  test('formularul de utilizator nou se deschide', async () => {
    await page.goto('http://localhost:3000/admin/collections/users/create')
    await expect(page.locator('input[name="email"]')).toBeVisible()
  })
})
