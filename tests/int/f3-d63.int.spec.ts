// @vitest-environment node
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import sharp from 'sharp'
import { describe, expect, it } from 'vitest'

/**
 * D-63: creditul BizTech din footer: logo-ul rotund și 3 rânduri, centrate. Logo-ul e pătrat în toate
 * cele 3 mărimi (nu se deformează), iar colțurile sunt transparente (pe fundalul închis nu apare alb).
 */

const root = process.cwd()
const footer = readFileSync(join(root, 'src/components/site/SiteFooter.tsx'), 'utf8')
const css = readFileSync(join(root, 'src/app/(frontend)/styles.css'), 'utf8')

describe('D-63 · creditul BizTech în footer', () => {
  it('Cele 3 rânduri, cu linkurile de telefon și site', () => {
    expect(footer).toContain('100% AI Solutions &amp; Agentic WorkFlows')
    expect(footer).toContain('SW Development')
    expect(footer).toContain('Made with ❤️ by BizTech Consulting SRL')
    expect(footer).toContain('Alin Labau - AI Project Manager')
    expect(footer).toContain('href="tel:+40772295031">+40 772 295 031<')
    expect(footer).toContain('href="https://www.biztech.ro/"')
  })

  it('Logo-ul: 96…432 px, pătrat, cu colțuri transparente', async () => {
    for (const size of [96, 144, 192, 288, 432]) {
      const file = join(root, `public/brand/biztech-${size}.webp`)
      const meta = await sharp(file).metadata()
      expect([meta.width, meta.height]).toEqual([size, size])
      expect(meta.hasAlpha).toBe(true)
      const { data } = await sharp(file).ensureAlpha().extract({ left: 0, top: 0, width: 1, height: 1 }).raw().toBuffer({ resolveWithObject: true })
      expect(data[3]).toBe(0)
    }
    expect(footer).toContain('sizes="(min-width: 1024px) 144px, 96px"')
  })

  it('Proporția se păstrează pe orice ecran, iar pe telefon rândurile se așază pe segmente', () => {
    expect(css).toMatch(/\.footer-maker-logo \{[^}]*width: 96px; height: auto; aspect-ratio: 1;/)
    expect(css).toMatch(/@media \(min-width: 1024px\) \{ \.footer-maker-logo \{ width: 144px; \} \}/)
    expect(css).toMatch(/@media \(max-width: 559px\) \{\s*\.footer-maker-line \{ flex-direction: column;/)
    expect(css).toMatch(/\.footer-maker a \{[^}]*min-height: 24px;/)
  })
})
