// @vitest-environment node
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

import { Media } from '@/collections/Media'
import { HomePage } from '@/collections/HomePage'
import { detectKind, prepareDocument, RejectedFileError } from '@/components/admin/media/convert'
import { DICTS } from '@/lib/site/i18n'
import { downloadUrl } from '@/lib/site/media'
import type { Media as MediaDoc } from '@/payload-types'

/**
 * D-69: (1) logo-ul oficial al premiului e de 2 ori mai mare în toate locurile (hero, Vinuri, footer);
 * varianta provizorie, cu text, rămâne la mărimea locului. (2) Lista de vinuri poate avea un PDF, ales
 * în panou (Pagina Acasă → Vinuri); pe /catalog-vinuri apare butonul „Descarcă PDF”.
 */

const read = (f: string) => readFileSync(join(process.cwd(), f), 'utf8')

describe('D-69 · insigna de 2 ori mai mare', () => {
  it('doar logo-ul oficial se dublează: hero 144/192, Vinuri 240, footer 112', () => {
    const css = read('src/app/(frontend)/[lang]/styles.css')
    expect(css).toContain('.award--official.award--hero { height: calc(var(--badge-h) * 2); }')
    expect(css).toContain('.award--official.award--section { height: 240px; }')
    expect(css).toContain('.award--official.award--footer { height: 112px; }')
    // Locul rezervat (provizoriu) rămâne cel din wireframe.
    expect(css).toContain('.award--section { height: 120px; }')
  })
})

describe('D-69 · lista de vinuri în PDF', () => {
  it('Biblioteca media primește tipul „Document PDF”, doar application/pdf', () => {
    const kind = Media.fields.find((f) => 'name' in f && f.name === 'kind') as { options: { value: string }[] }
    expect(kind.options.map((o) => o.value)).toContain('document')
    expect((Media.upload as { mimeTypes: string[] }).mimeTypes).toContain('application/pdf')
  })

  it('Pagina Acasă → Vinuri are câmpul PDF, care arată doar documente', () => {
    const tabs = (HomePage.fields[0] as { tabs: { name?: string; fields: any[] }[] }).tabs
    const wines = tabs.find((t) => t.name === 'wines')!
    const pdf = wines.fields.find((f) => f.name === 'pdf')
    expect(pdf.type).toBe('upload')
    expect(pdf.filterOptions).toEqual({ kind: { in: ['document'] } })
  })

  it('unealta de încărcare recunoaște PDF-ul și îl lasă neschimbat; refuză un fișier care nu e PDF', async () => {
    const body = '%PDF-1.7\n1 0 obj <<>> endobj\nstartxref\n9\n%%EOF\n'
    const pdf = new File([body], 'Lista vinuri.pdf', { type: 'application/pdf' })
    expect(detectKind(pdf)).toBe('document')
    expect(await prepareDocument(pdf)).toBe(pdf)
    // Fără tip MIME (se întâmplă pe Windows), dar cu semnătura PDF: primește tipul corect.
    const bare = await prepareDocument(new File([body], 'lista.pdf'))
    expect(bare.type).toBe('application/pdf')
    // Nu e PDF; e PDF trunchiat (fără xref / %%EOF la final): refuzate aici, ca pe server.
    await expect(prepareDocument(new File(['nu e pdf'], 'lista.pdf', { type: 'application/pdf' }))).rejects.toBeInstanceOf(RejectedFileError)
    await expect(prepareDocument(new File(['%PDF-1.7\n1 0 obj'], 'lista.pdf', { type: 'application/pdf' }))).rejects.toThrow('incomplet')
  })

  it('butonul descarcă fișierul de pe Supabase (?download=numele), altfel adresa simplă', () => {
    const doc = (url: string) => ({ url, filename: 'Lista vinuri.pdf' }) as MediaDoc
    expect(downloadUrl(doc('https://x.storage.supabase.co/storage/v1/object/public/media/Lista vinuri.pdf'))).toBe(
      'https://x.storage.supabase.co/storage/v1/object/public/media/Lista vinuri.pdf?download=Lista%20vinuri.pdf',
    )
    expect(downloadUrl(doc('/api/media/file/lista.pdf'))).toBe('/api/media/file/lista.pdf')
    const page = read('src/app/(frontend)/[lang]/catalog-vinuri/page.tsx')
    expect(page).toContain('href={downloadUrl(pdf)}')
    expect(page).toContain('{UI.wineDownloadPdf}')
  })

  it('textul butonului există în toate cele 7 limbi', () => {
    const labels = Object.values(DICTS).map((d) => (d as { wineDownloadPdf: string }).wineDownloadPdf)
    expect(labels).toHaveLength(7)
    expect(labels[0]).toBe('Descarcă PDF')
    for (const l of labels) expect(l).toMatch(/PDF/)
  })
})
