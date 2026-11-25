import { notFound, permanentRedirect, redirect } from 'next/navigation'

import { getRedirect } from '@/lib/site/data'
import { getActiveSite } from '@/lib/site/locale'

/**
 * F5 (G7-2): adresele vechi cu mai multe segmente (de exemplu `/gallery/locatie/` de pe davittoria.ro)
 * se caută în Redirecționări (panou → Setări). Altfel 404, ca până acum. Adresele dintr-un singur
 * segment trec prin `[slug]` (pagini legale, apoi redirecționări).
 */
type Props = { params: Promise<{ slug: string; rest: string[] }> }

export default async function OldAddress({ params }: Props) {
  const { slug, rest } = await params
  const site = await getActiveSite()
  if (!site) notFound()
  const path = '/' + [slug, ...rest].map((p) => decodeURIComponent(p)).join('/')
  const r = await getRedirect(site.tenant.id, path)
  if (!r) notFound()
  ;(r.permanent ? permanentRedirect : redirect)(r.to)
}
