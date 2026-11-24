import os from 'node:os'

import { runVariantsBenchmark } from '@/lib/media/variants-benchmark'

/**
 * TEMPORAR, doar pentru testul F0 „imagini” (ADR-004): măsoară pe Vercel timpul și memoria
 * generării variantelor AVIF/WebP dintr-un master de 2560 px. Se șterge după GATE 0.
 * Masterul de test: fotografie Unsplash (licență Unsplash), cerută la 2560 px, JPEG q90.
 */
export const dynamic = 'force-dynamic'
export const maxDuration = 120

const TEST_MASTER =
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?fm=jpg&q=90&w=2560'

export async function GET(request: Request) {
  const mode = new URL(request.url).searchParams.get('mode') === 'parallel' ? 'parallel' : 'sequential'
  const t0 = performance.now()
  const res = await fetch(TEST_MASTER, { cache: 'no-store' })
  if (!res.ok) return Response.json({ error: `master: HTTP ${res.status}` }, { status: 502 })
  const master = Buffer.from(await res.arrayBuffer())
  const fetchMs = Math.round(performance.now() - t0)
  const result = await runVariantsBenchmark(master, mode)
  return Response.json(
    {
      fetchMs,
      runtime: {
        node: process.version,
        cpus: os.cpus().length,
        cpuModel: os.cpus()[0]?.model,
        totalMemMB: Math.round(os.totalmem() / 1e6),
        region: process.env.VERCEL_REGION ?? null,
      },
      ...result,
    },
    { headers: { 'X-Robots-Tag': 'noindex, nofollow', 'Cache-Control': 'no-store' } },
  )
}
