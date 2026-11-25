import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

const NOINDEX = { key: 'X-Robots-Tag', value: 'noindex, nofollow' }

const nextConfig: NextConfig = {
  images: {
    localPatterns: [
      {
        pathname: '/api/media/file/**',
      },
    ],
  },
  // F4 (D-64): româna stă la rădăcină, fără prefix. Intern, `/galerie` devine `/ro/galerie`, ca toate
  // paginile să stea sub `app/(frontend)/[lang]`. Celelalte limbi au prefixul lor (`/en/galerie`).
  // `afterFiles`: fișierele din `public/`, `/_next`, panoul și API-ul au întâietate.
  //
  // D-72: pe Vercel, cererile routerului (navigarea între pagini) ajung aici cu sufix: `/galerie.rsc`,
  // `/galerie.segments/_tree.segment.rsc`, iar Acasă ca `/index.rsc`, `/index.segments/…`. Regula lasă
  // să treacă aceste sufixe (fișierele cu altă extensie rămân neatinse); altfel cererea cădea pe
  // `/[lang]` cu „lang = galerie” și linkurile afișau Acasă până la reîncărcare.
  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [
        { source: '/', destination: '/ro' },
        { source: '/index.rsc', destination: '/ro.rsc' },
        { source: '/index.segments/:rest*', destination: '/ro.segments/:rest*' },
        {
          source: '/:path((?!(?:ro|en|it|fr|de|zh|sv|admin|api)(?:/|$|\\.))(?!_)(?!index\\.)(?!.*\\.(?!rsc$)[a-z0-9]+$).*)',
          destination: '/ro/:path',
        },
      ],
      fallback: [],
    }
  },
  // `/ro/…` scris de mână duce la adresa fără prefix (o singură adresă pe pagină, pentru căutare).
  async redirects() {
    return [
      { source: '/ro', destination: '/', permanent: true },
      { source: '/ro/:path*', destination: '/:path*', permanent: true },
    ]
  },
  // Antetul X-Robots-Tag (ADR-012). Aceeași regulă ca în src/lib/indexing.ts.
  async headers() {
    const rules = [
      // Panoul și API-ul nu se indexează niciodată.
      { source: '/admin/:path*', headers: [NOINDEX] },
      { source: '/api/:path*', headers: [NOINDEX] },
      // Adresele Vercel nu se indexează niciodată, nici după lansare.
      {
        source: '/:path*',
        has: [{ type: 'host' as const, value: '(?<sub>.*)\\.vercel\\.app' }],
        headers: [NOINDEX],
      },
    ]
    // Până la lansare (ALLOW_INDEXING diferit de "true"): nimic nu se indexează.
    if (process.env.ALLOW_INDEXING !== 'true') {
      rules.push({ source: '/:path*', headers: [NOINDEX] })
    }
    return rules
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  turbopack: {
    root: path.resolve(dirname),
  },
}

const withPayloadConfig = withPayload(nextConfig, { devBundleServerPackages: false })

/**
 * F3 (Lighthouse): Payload adaugă pe TOATE adresele `Accept-CH` / `Critical-CH:
 * Sec-CH-Prefers-Color-Scheme`, pentru tema panoului. Pe site, `Critical-CH` face browserul să
 * reîncarce documentul o dată (≈ 610 ms în simularea Lighthouse pe mobil). Regula rămâne doar pe /admin.
 */
const payloadHeaders = withPayloadConfig.headers
withPayloadConfig.headers = async () => {
  const rules = payloadHeaders ? await payloadHeaders() : []
  return rules.map((rule) =>
    rule.source === '/:path*' && rule.headers.some((h) => h.key === 'Critical-CH')
      ? { ...rule, source: '/admin/:path*' }
      : rule,
  )
}

export default withPayloadConfig
