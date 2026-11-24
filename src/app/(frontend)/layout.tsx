import type { Metadata } from 'next'
import { headers } from 'next/headers'
import React from 'react'

import { isIndexingAllowed } from '@/lib/indexing'
import './styles.css'

export async function generateMetadata(): Promise<Metadata> {
  const host = (await headers()).get('host')
  return {
    // Meta robots (ADR-012): noindex cât timp indexarea nu este permisă.
    robots: isIndexingAllowed(host) ? undefined : { index: false, follow: false },
  }
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="ro">
      <body>
        <main>{children}</main>
      </body>
    </html>
  )
}
