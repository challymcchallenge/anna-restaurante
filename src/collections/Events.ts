import type { CollectionConfig } from 'payload'

import { contentAccess } from '../access/roles'
import { contentFlags, media, select, text, textarea } from '../fields'

/** Seri tematice (content-model 5.4, D-09). Nu există o listă fixă de teme: orice nume este valid. */
export const Events: CollectionConfig = {
  slug: 'events',
  labels: { singular: 'Seară tematică', plural: 'Seri tematice' },
  admin: {
    group: 'Conținut',
    useAsTitle: 'name',
    defaultColumns: ['name', 'startsAt', 'type', 'status', 'active', 'placeholder'],
    description:
      'Serile cu DJ, artiști sau formații. O seară trecută iese singură din agendă și intră în arhiva foto.',
  },
  defaultSort: '-startsAt',
  access: contentAccess,
  fields: [
    text({ name: 'name', label: 'Numele serii', max: 50, required: true, nt: true }),
    {
      type: 'row',
      fields: [
        {
          name: 'startsAt',
          label: 'Data și ora de început',
          type: 'date',
          required: true,
          index: true,
          admin: {
            date: { pickerAppearance: 'dayAndTime', timeFormat: 'HH:mm', displayFormat: 'dd.MM.yyyy HH:mm' },
            description: 'Ora României.',
          },
          // La publicare, data trebuie să fie în viitor (content-model 5.4).
          validate: ((value: unknown, { operation, previousValue }: any) => {
            if (!value) return 'Câmpul este obligatoriu.'
            const changed = operation === 'create' || String(previousValue ?? '') !== String(value)
            if (changed && new Date(String(value)).getTime() < Date.now()) {
              return 'Data trebuie să fie în viitor.'
            }
            return true
          }) as any,
        },
        {
          name: 'endsAt',
          label: 'Ora de sfârșit',
          type: 'date',
          admin: { date: { pickerAppearance: 'timeOnly', timeFormat: 'HH:mm', displayFormat: 'HH:mm' } },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        select({
          name: 'type',
          label: 'Tip',
          required: true,
          defaultValue: 'dj',
          options: [
            { value: 'dj', label: 'DJ' },
            { value: 'artist', label: 'Artist' },
            { value: 'band', label: 'Formație' },
            { value: 'other', label: 'Altul' },
          ],
        }),
        text({ name: 'guest', label: 'Numele invitatului', max: 50, nt: true }),
      ],
    },
    media({
      name: 'poster',
      label: 'Afiș sau fotografie',
      format: 'CARD-P',
      description: 'Este și imaginea de distribuire pe rețele.',
      requiredUnlessPlaceholder: true,
    }),
    textarea({ name: 'description', label: 'Descriere scurtă', max: 200, localized: true }),
    text({
      name: 'entry',
      label: 'Intrare',
      max: 40,
      localized: true,
      description: 'De exemplu „Intrare liberă”. Se completează la fiecare seară, dacă este cazul.',
    }),
    {
      name: 'bookWithDate',
      label: 'Rezervare cu data serii',
      type: 'checkbox',
      defaultValue: true,
      admin: { description: 'Butonul deschide fereastra ialoc cu data serii preselectată (probat în F0).' },
    },
    media({
      name: 'photosAfter',
      label: 'Fotografii după eveniment',
      format: 'GAL',
      hasMany: true,
      maxRows: 20,
      description: 'Apar în arhiva foto și în Galerie, la categoria Petreceri.',
    }),
    {
      name: 'status',
      label: 'Stare',
      type: 'text',
      virtual: true,
      admin: { readOnly: true, position: 'sidebar', description: 'Calculată: viitoare sau trecută.' },
      hooks: {
        afterRead: [
          ({ siblingData }) =>
            siblingData?.startsAt && new Date(siblingData.startsAt).getTime() < Date.now()
              ? 'trecută'
              : 'viitoare',
        ],
      },
    },
    ...contentFlags(),
  ],
}
