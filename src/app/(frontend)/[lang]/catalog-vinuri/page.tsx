import type { Metadata } from 'next'
import React from 'react'

import { AwardBadge, awardsFor } from '@/components/site/Bits'
import { Icon } from '@/components/site/Icons'
import { PageCover } from '@/components/site/Events'
import { GroupLogo, WineFilter, WineSheetGroup } from '@/components/site/WineList'
import { WineSearch } from '@/components/site/WineSearch'
import { getWineList } from '@/lib/site/data'
import { asMedia, downloadUrl } from '@/lib/site/media'
import { getActiveSite, localeAlternates } from '@/lib/site/locale'
import { sitePage } from '@/lib/site/page'
import { section } from '@/lib/site/sections'
import { renderLocale, UI } from '@/lib/site/i18n/server'
import { byTypeGroups, typesIn } from '@/lib/site/wines'

/**
 * S-23 · Lista de vinuri (D-14, D-19, D-46): toate vinurile disponibile, în formatul deschis
 * (poza 7 a lui Alin): pe tip, apoi țara · regiunea; producătorul îngroșat, anul, prețul; dedesubt
 * denumirea de origine și soiurile. Filtrul pe tip și căutarea, ca în wireframe. Insigna premiului
 * stă în antetul paginii (D-20, locul 3). Dacă în panou e ales PDF-ul listei (Pagina Acasă → Vinuri),
 * sub ea apare „Descarcă PDF” (D-69).
 */
export async function generateMetadata(): Promise<Metadata> {
  const site = await getActiveSite()
  if (!site) return {}
  const w = section(site.home, 'wines')
  // Fără text introductiv în panou: descrierea se compune din listă (numărul de vinuri, țările).
  const wines = w?.intro ? [] : await getWineList(site.tenant.id, site.locale)
  const countries = [...new Set(wines.map((x) => x.country).filter((c): c is string => Boolean(c)))]
  return {
    title: `${w?.title || UI.wineListTitle} · ${site.tenant.name}`,
    description: w?.intro || UI.wineMetaDescription(site.tenant.name, UI.wineCount(wines.length), countries),
    alternates: localeAlternates(site, '/catalog-vinuri'),
  }
}

export default async function WineListPage() {
  const site = await sitePage('wines')
  const w = section(site.home, 'wines')
  const award = awardsFor(site.awards, 'wines-page')[0]
  const wines = await getWineList(site.tenant.id, site.locale)
  const glass = wines.filter((x) => x.priceGlass != null)
  const pdf = asMedia(w?.pdf)

  return (
    <>
      <PageCover
        title={w?.title || ''}
        intro={w?.intro}
        placeholder={Boolean(w?.placeholder)}
        above={<GroupLogo site={site} onDark className="cover-logo rise" />}
      >
        {award && (
          <div className="page-award">
            <AwardBadge award={award} size="section" />
            {award.line && <p className="wines-line">{award.line}</p>}
          </div>
        )}
        {pdf && (
          <p className="page-actions">
            <a className="btn btn-ghost" href={downloadUrl(pdf)} download={pdf.filename || true} type="application/pdf">
              <Icon name="download" />
              {UI.wineDownloadPdf}
            </a>
          </p>
        )}
      </PageCover>

      <section className="wine-page paper-section" aria-label={w?.title || undefined}>
        <div className="wrap">
          <div className="wine-sheet wine-board" id="lista">
            <div className="wine-tools">
              <WineFilter name="tip" types={typesIn(wines)} />
              <WineSearch locale={renderLocale()} boardId="lista" />
            </div>
            {glass.length > 0 && <WineSheetGroup type="glass" wines={glass} glass />}
            {byTypeGroups(wines).map((g) => (
              <WineSheetGroup key={g.type} type={g.type} wines={g.wines} />
            ))}
            <footer className="wine-sheet-foot">
              <p className="wine-note">{UI.winePageNote}</p>
              <GroupLogo site={site} className="wine-sheet-logo" />
            </footer>
          </div>
        </div>
      </section>
    </>
  )
}
