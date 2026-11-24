import sharp from 'sharp'

/**
 * Test F0 (ADR-004): din masterul de cel mult 2560 px, generează variantele AVIF și WebP pe mai multe lățimi,
 * cum ar face Payload cu `imageSizes` și `formatOptions`. Măsoară timpul, memoria și mărimile.
 * Folosit de `scripts/f0/variants-benchmark.ts` (local) și de `/spike/variants` (pe Vercel).
 */
export const F0_WIDTHS = [640, 960, 1280, 1920, 2560] as const
export const F0_AVIF = { quality: 55, effort: 2 } as const
export const F0_WEBP = { quality: 78, effort: 4 } as const

export type VariantResult = { width: number; format: 'avif' | 'webp'; bytes: number; ms: number }
export type BenchmarkResult = {
  mode: 'sequential' | 'parallel'
  input: { width: number; height: number; bytes: number }
  totalMs: number
  peakRssMB: number
  variants: VariantResult[]
  sharp: { concurrency: number; versions: Record<string, string> }
}

export async function runVariantsBenchmark(
  master: Buffer,
  mode: 'sequential' | 'parallel' = 'sequential',
): Promise<BenchmarkResult> {
  const meta = await sharp(master).metadata()
  let peak = process.memoryUsage().rss
  const timer = setInterval(() => {
    peak = Math.max(peak, process.memoryUsage().rss)
  }, 20)

  const jobs = F0_WIDTHS.filter((w) => w <= (meta.width ?? 0)).flatMap((width) =>
    (['avif', 'webp'] as const).map((format) => async (): Promise<VariantResult> => {
      const t0 = performance.now()
      const pipeline = sharp(master).resize({ width, withoutEnlargement: true })
      const out =
        format === 'avif'
          ? await pipeline.avif(F0_AVIF).toBuffer()
          : await pipeline.webp(F0_WEBP).toBuffer()
      return { width, format, bytes: out.length, ms: Math.round(performance.now() - t0) }
    }),
  )

  const t0 = performance.now()
  const variants: VariantResult[] = []
  if (mode === 'parallel') {
    variants.push(...(await Promise.all(jobs.map((j) => j()))))
  } else {
    for (const j of jobs) variants.push(await j())
  }
  const totalMs = Math.round(performance.now() - t0)
  clearInterval(timer)
  peak = Math.max(peak, process.memoryUsage().rss)

  return {
    mode,
    input: { width: meta.width ?? 0, height: meta.height ?? 0, bytes: master.length },
    totalMs,
    peakRssMB: Math.round(peak / 1e6),
    variants,
    sharp: { concurrency: sharp.concurrency(), versions: sharp.versions as Record<string, string> },
  }
}
