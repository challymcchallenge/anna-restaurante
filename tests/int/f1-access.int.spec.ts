// @vitest-environment node
import crypto from 'crypto'
import type { Payload } from 'payload'
import { getPayload } from 'payload'
import sharp from 'sharp'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import config from '@/payload.config'
import { seedStarterContent } from '@/seed/starter'

/**
 * F1 · verificările GATE 1, pe baza locală (tests/helpers/env.ts refuză producția):
 * - Editorul nu deschide Premii, Setări, Redirecționări, Cereri, Utilizatori;
 * - Editorul lucrează doar în restaurantul lui;
 * - garda de pe server refuză originalele neconvertite;
 * - conținutul de pornire nu se dublează.
 */

let payload: Payload
let admin: any
let editor: any
let tenantA: number
let tenantB: number
const created: { collection: any; id: number | string }[] = []
const tag = crypto.randomBytes(4).toString('hex')

/** Mesajul complet al unei erori Payload (cel de sus e generic, detaliile sunt pe câmp). */
async function errorText(promise: Promise<unknown>): Promise<string> {
  try {
    await promise
  } catch (error: any) {
    const details = (error?.data?.errors ?? []).map((e: any) => `${e.path}: ${e.message}`).join(' | ')
    return `${error?.message ?? ''} ${details}`
  }
  throw new Error('Operația trebuia refuzată, dar a reușit.')
}

describe('F1 · roluri, restaurante, media', () => {
  beforeAll(async () => {
    payload = await getPayload({ config: await config })
    const tenants = await payload.find({ collection: 'tenants', sort: '_order', limit: 2 })
    if (tenants.docs.length < 2) {
      for (const [i, name] of ['Restaurant test A', 'Restaurant test B'].entries()) {
        if (tenants.docs[i]) continue
        const t = await payload.create({ collection: 'tenants', data: { name, slug: `test-${i}-${tag}` } })
        created.push({ collection: 'tenants', id: t.id })
        tenants.docs.push(t)
      }
    }
    tenantA = tenants.docs[0].id as number
    tenantB = tenants.docs[1].id as number
    admin = await payload.create({
      collection: 'users',
      data: { email: `admin.${tag}@example.test`, password: tag + 'A!', name: 'Admin test', role: 'administrator' } as any,
    })
    editor = await payload.create({
      collection: 'users',
      data: {
        email: `editor.${tag}@example.test`,
        password: tag + 'E!',
        name: 'Editor test',
        role: 'editor',
        tenants: [{ tenant: tenantA }],
      } as any,
    })
    editor = { ...editor, collection: 'users' }
    admin = { ...admin, collection: 'users' }
  })

  afterAll(async () => {
    for (const { collection, id } of created.reverse()) {
      await payload.delete({ collection, id }).catch(() => undefined)
    }
    await payload.delete({ collection: 'users', where: { email: { like: `.${tag}@example.test` } } })
  })

  it.each(['awards', 'settings', 'redirects', 'submissions'] as const)(
    'Editorul nu poate citi „%s”',
    async (collection) => {
      await expect(payload.find({ collection, user: editor, overrideAccess: false })).rejects.toThrow()
    },
  )

  it('Editorul vede doar contul propriu și restaurantul propriu', async () => {
    const users = await payload.find({ collection: 'users', user: editor, overrideAccess: false })
    expect(users.docs.map((u) => u.id)).toEqual([editor.id])
    const tenants = await payload.find({ collection: 'tenants', user: editor, overrideAccess: false })
    expect(tenants.docs.map((t) => t.id)).toEqual([tenantA])
  })

  it('Administratorul citește Premii și Setări', async () => {
    await expect(payload.find({ collection: 'awards', user: admin, overrideAccess: false })).resolves.toBeTruthy()
    await expect(payload.find({ collection: 'settings', user: admin, overrideAccess: false })).resolves.toBeTruthy()
  })

  it('Editorul adaugă o seară în restaurantul lui, nu în altul', async () => {
    const startsAt = new Date(Date.now() + 10 * 86_400_000).toISOString()
    const ev = await payload.create({
      collection: 'events',
      data: { name: `Seară test ${tag}`, startsAt, type: 'dj', placeholder: true, tenant: tenantA },
      user: editor,
      overrideAccess: false,
    })
    created.push({ collection: 'events', id: ev.id })
    expect(ev.status).toBe('viitoare')
    await expect(
      payload.create({
        collection: 'events',
        data: { name: `Altă seară ${tag}`, startsAt, type: 'dj', placeholder: true, tenant: tenantB },
        user: editor,
        overrideAccess: false,
      }),
    ).rejects.toThrow()
  })

  it('O seară fără afiș se salvează doar ca „Provizoriu”; o seară în trecut e refuzată', async () => {
    const startsAt = new Date(Date.now() + 5 * 86_400_000).toISOString()
    expect(
      await errorText(
        payload.create({
          collection: 'events',
          data: { name: `Fără afiș ${tag}`, startsAt, type: 'band', placeholder: false, tenant: tenantA },
        }),
      ),
    ).toMatch(/poster: .*Provizoriu/)
    expect(
      await errorText(
        payload.create({
          collection: 'events',
          data: { name: `Trecut ${tag}`, startsAt: '2020-01-01T18:00:00.000Z', type: 'dj', placeholder: true, tenant: tenantA },
        }),
      ),
    ).toMatch(/startsAt: .*viitor/)
  })

  it('Editorul adaugă un vin; recomandate cel mult 10', async () => {
    const wine = await payload.create({
      collection: 'wines',
      data: { name: `Vin test ${tag}`, type: 'red', priceBottle: 99, volume: '0.75', tenant: tenantA },
      user: editor,
      overrideAccess: false,
    })
    created.push({ collection: 'wines', id: wine.id })
    expect(wine.name).toBe(`Vin test ${tag}`)

    const { totalDocs } = await payload.count({
      collection: 'wines',
      where: { and: [{ featured: { equals: true } }, { tenant: { equals: tenantA } }] },
    })
    for (let i = totalDocs; i < 10; i++) {
      const w = await payload.create({
        collection: 'wines',
        data: { name: `Rec ${i} ${tag}`, type: 'white', priceBottle: 50, volume: '0.75', featured: true, tenant: tenantA },
      })
      created.push({ collection: 'wines', id: w.id })
    }
    expect(
      await errorText(
        payload.create({
          collection: 'wines',
          data: { name: `Al 11-lea ${tag}`, type: 'white', priceBottle: 50, volume: '0.75', featured: true, tenant: tenantA },
        }),
      ),
    ).toMatch(/featured: .*10 vinuri/)
  })

  it('Garda media: refuză o fotografie neconvertită (> 2560 px), acceptă masterul și face 10 variante', async () => {
    const big = await sharp({ create: { width: 3000, height: 2000, channels: 3, background: '#7a1f1f' } }).jpeg().toBuffer()
    expect(
      await errorText(
        payload.create({
          collection: 'media',
          data: { kind: 'photo', alt: 'test', tenant: tenantA } as any,
          file: { data: big, mimetype: 'image/jpeg', name: `mare-${tag}.jpg`, size: big.length },
        }),
      ),
    ).toMatch(/3000 × 2000 px; limita este 2560/)

    const master = await sharp({ create: { width: 2560, height: 1707, channels: 3, background: '#e8c27a' } }).jpeg().toBuffer()
    const doc = await payload.create({
      collection: 'media',
      data: { kind: 'photo', alt: 'Master de test', tenant: tenantA } as any,
      file: { data: master, mimetype: 'image/jpeg', name: `master-${tag}.jpg`, size: master.length },
    })
    created.push({ collection: 'media', id: doc.id })
    const sizes = Object.entries(doc.sizes ?? {}).filter(([, v]: any) => v?.width)
    expect(sizes.map(([k]) => k).sort()).toEqual(
      ['avif1280', 'avif1920', 'avif2560', 'avif640', 'avif960', 'webp1280', 'webp1920', 'webp2560', 'webp640', 'webp960'].sort(),
    )
    expect((doc.sizes as any).avif640.mimeType).toBe('image/avif')
  })

  it('Fotografie fără text alternativ: refuzată', async () => {
    const img = await sharp({ create: { width: 800, height: 600, channels: 3, background: '#204060' } }).jpeg().toBuffer()
    expect(
      await errorText(
        payload.create({
          collection: 'media',
          data: { kind: 'photo', tenant: tenantA } as any,
          file: { data: img, mimetype: 'image/jpeg', name: `fara-alt-${tag}.jpg`, size: img.length },
        }),
      ),
    ).toMatch(/alt: Fără text alternativ/)
  })

  it('Setări: contrastul text/fundal sub 4,5:1 nu se poate salva', async () => {
    const { docs } = await payload.find({ collection: 'settings', where: { tenant: { equals: tenantA } }, limit: 1 })
    if (!docs[0]) return
    expect(
      await errorText(
        payload.update({
          collection: 'settings',
          id: docs[0].id,
          data: { colors: { background: '#ffffff', text: '#cccccc' } } as any,
        }),
      ),
    ).toMatch(/colors\.text: Contrast 1,61:1 .*4,5:1/)
  })

  it('Conținutul de pornire nu se dublează la a doua rulare', async () => {
    const report = await seedStarterContent({ payload })
    for (const r of report) expect(r.created).toEqual({})
  })
})
