import type { CollectionConfig } from 'payload'

import { contentAccess } from '../access/roles'
import { contentFlags, media, text, textarea } from '../fields'

/** Saloane (content-model 5.5). */
export const Salons: CollectionConfig = {
  slug: 'salons',
  labels: { singular: 'Salon', plural: 'Saloane' },
  orderable: true,
  admin: {
    group: 'Conținut',
    useAsTitle: 'name',
    defaultColumns: ['name', 'capacity', 'location', 'active', 'placeholder'],
    description:
      'Formularul sugerează salonul după numărul de invitați; peste cea mai mare capacitate îndrumă către Riviera Events sau ANNA Events (D-32).',
  },
  access: contentAccess,
  fields: [
    {
      type: 'row',
      fields: [
        text({ name: 'name', label: 'Nume', max: 30, required: true, nt: true }),
        text({ name: 'location', label: 'Amplasare', max: 40, localized: true, description: 'De exemplu „la etaj”.' }),
        { name: 'capacity', label: 'Capacitate maximă', type: 'number', required: true, min: 1 },
      ],
    },
    textarea({ name: 'description', label: 'Descriere', max: 300, required: true, localized: true }),
    media({
      name: 'photos',
      label: 'Fotografii',
      format: 'CARD-L',
      hasMany: true,
      maxRows: 10,
      description: 'Între 3 și 10.',
      validate: ((value: unknown, args: any) => {
        const n = Array.isArray(value) ? value.length : 0
        if (args?.siblingData?.placeholder || args?.data?.placeholder) return true
        return n >= 3 ? true : 'Adaugă cel puțin 3 fotografii (sau bifează „Provizoriu”).'
      }) as any,
    }),
    {
      name: 'amenities',
      label: 'Dotări',
      type: 'array',
      maxRows: 8,
      labels: { singular: 'Dotare', plural: 'Dotări' },
      fields: [text({ name: 'label', label: 'Dotare', max: 30, required: true, localized: true })],
    },
    ...contentFlags(),
  ],
}

/** Tipuri de camere (content-model 5.6). Apar și ca opțiuni în cererea de cazare. */
export const RoomTypes: CollectionConfig = {
  slug: 'room-types',
  labels: { singular: 'Tip de cameră', plural: 'Tipuri de camere' },
  orderable: true,
  admin: {
    group: 'Conținut',
    useAsTitle: 'name',
    defaultColumns: ['name', 'active', 'placeholder'],
  },
  access: contentAccess,
  fields: [
    text({ name: 'name', label: 'Nume', max: 40, required: true, nt: true }),
    textarea({ name: 'description', label: 'Descriere', max: 160, localized: true }),
    media({ name: 'photo', label: 'Fotografie', format: 'CARD-L', requiredUnlessPlaceholder: true }),
    ...contentFlags(),
  ],
}
