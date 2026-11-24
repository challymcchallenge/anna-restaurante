import { RichText, type JSXConvertersFunction } from '@payloadcms/richtext-lexical/react'
import React from 'react'

import { slugify } from '@/lib/site/format'

/**
 * Textul unei pagini legale (content-model 5.12): titlurile h2/h3 primesc ancore, ca să le poată
 * lega cuprinsul și oricine trimite un link spre o secțiune (de exemplu /confidentialitate#cookies).
 */
type Node = { type?: string; tag?: string; text?: string; children?: Node[] }

export const nodeText = (node: Node): string =>
  node.text ?? (node.children ?? []).map(nodeText).join('')

/** Titlurile h2, în ordine, pentru cuprins. */
export function legalHeadings(data: unknown): { id: string; text: string }[] {
  const root = (data as { root?: Node } | null)?.root
  return (root?.children ?? [])
    .filter((n) => n.type === 'heading' && n.tag === 'h2')
    .map((n) => ({ id: slugify(nodeText(n)), text: nodeText(n) }))
    .filter((h) => h.id)
}

const converters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
  heading: ({ node, nodesToJSX }) => {
    const Tag = node.tag === 'h3' ? 'h3' : 'h2'
    return <Tag id={slugify(nodeText(node as Node)) || undefined}>{nodesToJSX({ nodes: node.children })}</Tag>
  },
})

export function LegalContent({ data }: { data: unknown }) {
  return <RichText data={data as never} converters={converters} className="legal-text" />
}
