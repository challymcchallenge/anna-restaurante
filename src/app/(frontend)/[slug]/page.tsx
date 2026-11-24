import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { notFound, permanentRedirect, redirect } from 'next/navigation'
import React from 'react'

import { PageCover } from '@/components/site/Events'
import { LegalContent, legalHeadings } from '@/components/site/LegalContent'
import { getSite, getSlugPage } from '@/lib/site/data'
import { UI } from '@/lib/site/strings'

/**
 * Paginile legale (PLAN F3 pasul 10, content-model 5.12): termeni, confidențialitate, cookies, la
 * adresa scurtă din panou. Dacă nu e o pagină legală, adresa poate fi o redirecționare din panou
 * (R5, de exemplu /valori-nutritionale către meniul digital); altfel 404.
 */
type Props = { params: Promise<{ slug: string }> }

async function resolve(slug: string) {
  const site = await getSite((await headers()).get('host'))
  if (!site) return null
  return { site, ...(await getSlugPage(site.tenant.id, decodeURIComponent(slug).toLowerCase())) }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const r = await resolve((await params).slug)
  if (!r?.page) return {}
  return {
    title: `${r.page.title} · ${r.site.tenant.name}`,
    description: UI.legalMeta(r.page.title, r.site.tenant.name, legalHeadings(r.page.content).map((h) => h.text)),
  }
}

export default async function LegalPage({ params }: Props) {
  const r = await resolve((await params).slug)
  if (!r) notFound()
  if (!r.page) {
    if (r.redirect) (r.redirect.permanent ? permanentRedirect : redirect)(r.redirect.to)
    notFound()
  }
  const page = r.page
  const toc = legalHeadings(page.content)
  const updated = new Intl.DateTimeFormat('ro-RO', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Bucharest' }).format(
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
            <LegalContent data={page.content} />
          </article>
        </div>
      </section>
    </>
  )
}
