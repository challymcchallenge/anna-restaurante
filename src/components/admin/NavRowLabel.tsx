'use client'

import { useRowLabel } from '@payloadcms/ui'
import React from 'react'

import { NAV_DISPLAY_OPTIONS, NAV_TARGET_OPTIONS } from '@/lib/site/sections'

/**
 * Eticheta unui rând din „Setări → Meniu de navigare” (D-60): ținta și afișarea, de exemplu
 * „Acasă · Bucătăria — În antet (cât încape)”, ca ordinea să se vadă dintr-o privire.
 */
export function NavRowLabel() {
  const { data, rowNumber } = useRowLabel<{ target?: string; label?: string; display?: string }>()
  const target = NAV_TARGET_OPTIONS.find((o) => o.value === data?.target)?.label ?? `Element ${(rowNumber ?? 0) + 1}`
  const display = NAV_DISPLAY_OPTIONS.find((o) => o.value === data?.display)?.label
  const custom = data?.label?.trim()
  return (
    <span>
      {target}
      {custom ? ` („${custom}”)` : ''}
      {display ? ` — ${display}` : ''}
    </span>
  )
}
