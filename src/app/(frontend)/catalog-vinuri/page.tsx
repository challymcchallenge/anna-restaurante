import type { Metadata } from 'next'
import { headers } from 'next/headers'
import React from 'react'

import { AwardBadge, awardsFor } from '@/components/site/Bits'
import { PageCover } from '@/components/site/Events'
import { GroupLogo, WineFilter, WineSheetGroup } from '@/components/site/WineList'
import { WineSearch } from '@/components/site/WineSearch'
import { getSite, getWineList } from '@/lib/site/data'
import { sitePage } from '@/lib/site/page'
import { section } from '@/lib/site/sections'
import { UI } from '@/lib/site/strings'
import { byTypeGroups, typesIn } from '@/lib/site/wines'

/**
 * S-23 · Lista de vinuri (D-14, D-19, D-46): toate vinurile disponibile, în formatul deschis
 * (poza 7 a lui Alin): pe tip, apoi țara · regiunea; producătorul îngroșat, anul, prețul; dedesubt
 * denumirea de origine și soiurile. Filtrul pe tip și căutarea, ca în wireframe. Insigna premiului
 * stă în antetul paginii (D-20, locul 3).
 */
export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite((await headers()).get('host'))
  if (!site) return {}
  const w = section(site.home, 'wines')
  // Fără text introductiv în panou: descrierea se compune din listă (numărul de vinuri, țările).
  const wines = w?.intro ? [] : await getWineList(site.tenant.id)
  const countries = [...new Set(wines.map((x) => x.country).filter((c): c is string => Boolean(c)))]
  return {
    title: `${w?.title || UI.wineListTitle} · ${site.tenant.name}`,
    description: w?.intro || UI.wineMetaDescription(site.tenant.name, UI.wineCount(wines.length), countries),
  }
}

export default async function WineListPage() {
  const site = await sitePage('wines')
  const w = section(site.home, 'wines')
  const award = awardsFor(site.awards, 'wines-page')[0]
  const wines = await getWineList(site.tenant.id)
  const glass = wines.filter((x) => x.priceGlass != null)

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
      </PageCover>

      <section className="wine-page paper-section" aria-label={w?.title || undefined}>
        <div className="wrap">
          <div className="wine-sheet wine-board" id="lista">
            <div className="wine-tools">
              <WineFilter name="tip" types={typesIn(wines)} />
              <WineSearch boardId="lista" />
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
