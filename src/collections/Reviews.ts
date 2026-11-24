import type { CollectionConfig } from 'payload'

import { contentAccess } from '../access/roles'
import { contentFlags, select, text, textarea, url } from '../fields'

/** Recenzii (content-model 5.3, D-06). Lista reală vine de la Alin; până atunci, exemplele sunt „Provizoriu”. */
export const Reviews: CollectionConfig = {
  slug: 'reviews',
  labels: { singular: 'Recenzie', plural: 'Recenzii' },
  orderable: true,
  admin: {
    group: 'Conținut',
    useAsTitle: 'author',
    defaultColumns: ['author', 'group', 'source', 'date', 'active', 'placeholder'],
    description: 'Recenzii pentru restaurant și pentru hotel. Pe Acasă apar primele 3 active din grupul Restaurant.',
  },
  access: contentAccess,
  fields: [
    {
      type: 'row',
      fields: [
        text({ name: 'author', label: 'Autor', max: 30, required: true, nt: true, description: 'Prenume și inițială.' }),
        select({
          name: 'group',
          label: 'Grup',
          required: true,
          defaultValue: 'restaurant',
          options: [
            { value: 'restaurant', label: 'Restaurant' },
            { value: 'hotel', label: 'Hotel' },
          ],
        }),
      ],
    },
    textarea({
      name: 'text',
      label: 'Text',
      max: 280,
      required: true,
      localized: true,
      description: 'În celelalte limbi apare cu mențiunea „tradus din română”.',
    }),
    {
      type: 'row',
      fields: [
        select({
          name: 'source',
          label: 'Sursă',
          required: true,
          defaultValue: 'google',
          options: [
            { value: 'google', label: 'Google' },
            { value: 'tripadvisor', label: 'TripAdvisor' },
            { value: 'facebook', label: 'Facebook' },
            { value: 'other', label: 'Altă sursă' },
          ],
        }),
        {
          name: 'date',
          label: 'Luna și anul',
          type: 'date',
          required: true,
          admin: { date: { pickerAppearance: 'monthOnly', displayFormat: 'MMMM yyyy' } },
        },
        {
          name: 'rating',
          label: 'Notă (1–5)',
          type: 'number',
          min: 1,
          max: 5,
          admin: { step: 1 },
        },
      ],
    },
    url({ name: 'sourceUrl', label: 'Legătură către sursă' }),
    ...contentFlags(),
  ],
}
