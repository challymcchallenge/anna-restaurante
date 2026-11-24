import type { CollectionConfig } from 'payload'

/**
 * Seri tematice (content-model 5.4, D-09). Formă minimă pentru proba multi-tenant din F0;
 * câmpurile complete (invitat, afiș, intrare, fotografii) se adaugă în F1.
 */
export const Events: CollectionConfig = {
  slug: 'events',
  labels: { singular: 'Seară tematică', plural: 'Seri tematice' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'startsAt', 'type', 'placeholder'],
  },
  access: {
    // Site-ul public citește serile; scrierea cere autentificare.
    // Pluginul multi-tenant adaugă restricția pe restaurant pentru Editor.
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      label: 'Numele serii',
      type: 'text',
      required: true,
      maxLength: 50,
    },
    {
      name: 'startsAt',
      label: 'Data și ora de început',
      type: 'date',
      required: true,
      admin: { date: { pickerAppearance: 'dayAndTime' } },
    },
    {
      name: 'type',
      label: 'Tip',
      type: 'select',
      required: true,
      options: [
        { value: 'dj', label: 'DJ' },
        { value: 'artist', label: 'Artist' },
        { value: 'band', label: 'Formație' },
        { value: 'other', label: 'Altul' },
      ],
    },
    {
      name: 'active',
      label: 'Activ',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'placeholder',
      label: 'Provizoriu',
      type: 'checkbox',
      defaultValue: true,
      admin: { description: 'Pornit = pe site apare eticheta „Exemplu · de înlocuit” (D-08).' },
    },
  ],
}
