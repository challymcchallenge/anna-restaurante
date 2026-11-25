import type { Metadata } from 'next'
import { notFound, permanentRedirect, redirect } from 'next/navigation'
import React from 'react'

import { PageCover } from '@/components/site/Events'
import { LegalContent, legalHeadings } from '@/components/site/LegalContent'
import { getSlugPage } from '@/lib/site/data'
import { getActiveSite, localeAlternates } from '@/lib/site/locale'
import { lp, UI } from '@/lib/site/i18n/server'

/**
 * Paginile legale (PLAN F3 pasul 10, content-model 5.12): termeni, confidențialitate, cookies, la
 * adresa scurtă din panou. Dacă nu e o pagină legală, adresa poate fi o redirecționare din panou
 * (R5, de exemplu /valori-nutritionale către meniul digital); altfel 404.
 */
type Props = { params: Promise<{ slug: string }> }

async function resolve(slug: string) {
  const site = await getActiveSite()
  if (!site) return null
  return { site, ...(await getSlugPage(site.tenant.id, decodeURIComponent(slug).toLowerCase(), site.locale)) }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const r = await resolve((await params).slug)
  if (!r?.page) return {}
  return {
    title: `${r.page.title} · ${r.site.tenant.name}`,
    description: UI.legalMeta(r.page.title, r.site.tenant.name, legalHeadings(r.page.content).map((h) => h.text)),
    alternates: localeAlternates(r.site, `/${r.page.slug}`),
  }
}

export default async function LegalPage({ params }: Props) {
  const { slug } = await params
  // O singură adresă pe pagină: /TERMENI → /termeni (308).
  const decoded = decodeURIComponent(slug)
  if (decoded !== decoded.toLowerCase()) permanentRedirect(lp(`/${encodeURIComponent(decoded.toLowerCase())}`))
  const r = await resolve(slug)
  if (!r) notFound()
  if (!r.page) {
    if (r.redirect) (r.redirect.permanent ? permanentRedirect : redirect)(r.redirect.to)
    notFound()
  }
  const page = r.page
  const toc = legalHeadings(page.content)
  const updated = new Intl.DateTimeFormat(UI.intl, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Bucharest' }).format(
    new Date(page.updatedAt),
  )

  return (
    <>
      <PageCover title={page.title} intro={UI.legalUpdated(updated)} placeholder={Boolean(page.placeholder)} />
      <section className="legal-page paper-section" aria-label={page.title}>
        <div className={`wrap legal-grid${toc.length > 1 ? '' : ' legal-grid--single'}`}>
          {toc.length > 1 && (
            <nav className="legal-toc" aria-label={UI.legalToc}>
              <p className="legal-toc-title">{UI.legalToc}</p>
              <ol>
                {toc.map((h) => (
                  <li key={h.id}>
                    <a href={`#${h.id}`}>{h.text}</a>
                  </li>
                ))}
              </ol>
            </nav>
          )}
          <article className="legal-body">
            {/* F4-4 (D-64): în altă limbă decât româna, nota că textul e o traducere automată. */}
            {UI.legalTranslationNote && <p className="legal-note">{UI.legalTranslationNote}</p>}
            <LegalContent data={page.content} />
          </article>
        </div>
      </section>
    </>
  )
}
