import type { CollectionConfig } from 'payload'

import { contentAccess } from '../access/roles'
import { contentFlags, media, richText, select, text, url } from '../fields'

/** Categorii de preparate (content-model 5.1). Cel mult 10 active; ordine manuală. */
export const DishCategories: CollectionConfig = {
  slug: 'dish-categories',
  labels: { singular: 'Categorie de preparate', plural: 'Categorii de preparate' },
  orderable: true,
  admin: {
    group: 'Conținut',
    useAsTitle: 'name',
    defaultColumns: ['name', 'shortText', 'active', 'placeholder'],
    description: 'Cardurile din sliderul „Bucătăria”. Fără legătură = adresa meniului digital din Setări.',
  },
  access: contentAccess,
  fields: [
    text({ name: 'name', label: 'Nume', max: 32, required: true, nt: true, description: 'De exemplu „Pasta e Risotto”.' }),
    text({ name: 'shortText', label: 'Text scurt', max: 70, localized: true }),
    media({ name: 'photo', label: 'Fotografie', format: 'CARD-P', requiredUnlessPlaceholder: true }),
    url({
      name: 'link',
      label: 'Legătură',
      description:
        'Opțional. Poate duce direct la categoria din meniul digital (…/trattoriadavittoria#id-categorie, probat în F0).',
    }),
    ...contentFlags(),
  ],
}

/** Galerie (content-model 5.7). */
export const Gallery: CollectionConfig = {
  slug: 'gallery',
  labels: { singular: 'Element de galerie', plural: 'Galerie' },
  orderable: true,
  admin: {
    group: 'Conținut',
    useAsTitle: 'caption',
    defaultColumns: ['file', 'category', 'caption', 'onHome', 'active'],
    description: 'Fotografii și clipuri pe categorii. Cele bifate „Pe Acasă” (cel mult 8) apar în secțiunea Galerie.',
  },
  access: contentAccess,
  fields: [
    media({ name: 'file', label: 'Fișier', kinds: ['photo', 'clip'], format: 'GAL', required: true }),
    {
      name: 'category',
      label: 'Categorie',
      type: 'relationship',
      relationTo: 'gallery-categories',
      required: true,
    },
    text({ name: 'caption', label: 'Legendă', max: 80, localized: true }),
    {
      name: 'onHome',
      label: 'Pe Acasă',
      type: 'checkbox',
      defaultValue: false,
      validate: (async (value: unknown, { req, data, id }: any) => {
        if (!value) return true
        const tenant = typeof data?.tenant === 'object' ? data?.tenant?.id : data?.tenant
        const { totalDocs } = await req.payload.count({
          collection: 'gallery',
          req,
          overrideAccess: true,
          where: {
            and: [
              { onHome: { equals: true } },
              ...(tenant ? [{ tenant: { equals: tenant } }] : []),
              ...(id ? [{ id: { not_equals: id } }] : []),
            ],
          },
        })
        return totalDocs < 8 ? true : 'Sunt deja 8 elemente pe Acasă. Debifează unul înainte.'
      }) as any,
    },
    ...contentFlags(),
  ],
}

/** Categoriile galeriei: listă editabilă (content-model 5.7). */
export const GalleryCategories: CollectionConfig = {
  slug: 'gallery-categories',
  labels: { singular: 'Categorie de galerie', plural: 'Categorii de galerie' },
  orderable: true,
  admin: { group: 'Conținut', useAsTitle: 'name', defaultColumns: ['name', 'active'] },
  access: contentAccess,
  fields: [text({ name: 'name', label: 'Nume', max: 20, required: true, localized: true }), ...contentFlags()],
}

/** Întrebări frecvente (content-model 5.8, Q-24). */
export const Faqs: CollectionConfig = {
  slug: 'faqs',
  labels: { singular: 'Întrebare frecventă', plural: 'Întrebări frecvente' },
  orderable: true,
  admin: {
    group: 'Conținut',
    useAsTitle: 'question',
    defaultColumns: ['question', 'group', 'active', 'placeholder'],
    description: 'Pe Acasă apar cel mult 5 din grupul Acasă.',
  },
  access: contentAccess,
  fields: [
    text({ name: 'question', label: 'Întrebare', max: 120, required: true, localized: true }),
    richText({ name: 'answer', label: 'Răspuns', max: 600, required: true, localized: true }),
    select({
      name: 'group',
      label: 'Grup',
      required: true,
      defaultValue: 'home',
      options: [
        { value: 'home', label: 'Acasă' },
        { value: 'private-events', label: 'Evenimente private' },
        { value: 'pizza', label: 'Cursuri de pizza' },
        { value: 'stay', label: 'Cazare' },
        { value: 'restaurant', label: 'Restaurant' },
      ],
    }),
    ...contentFlags(),
  ],
}

/** Motive de sesizare (content-model 5.9). Lista de pornire: cele 9 de pe site-ul actual (D-32). */
export const ComplaintReasons: CollectionConfig = {
  slug: 'complaint-reasons',
  labels: { singular: 'Motiv de sesizare', plural: 'Motive de sesizare' },
  orderable: true,
  admin: { group: 'Conținut', useAsTitle: 'reason', defaultColumns: ['reason', 'active'] },
  access: contentAccess,
  fields: [text({ name: 'reason', label: 'Motiv', max: 80, required: true, localized: true }), ...contentFlags()],
}

/** Linkuri grup, în footer (content-model 5.11). */
export const GroupLinks: CollectionConfig = {
  slug: 'group-links',
  labels: { singular: 'Link grup', plural: 'Linkuri grup' },
  orderable: true,
  admin: { group: 'Conținut', useAsTitle: 'name', defaultColumns: ['name', 'url', 'active', 'placeholder'] },
  access: contentAccess,
  fields: [
    text({ name: 'name', label: 'Nume', max: 40, required: true, nt: true }),
    url({
      name: 'url',
      label: 'Adresă',
      description: 'Obligatorie; poate lipsi doar cât timp elementul este „Provizoriu”.',
      validate: ((value: unknown, args: any) => {
        if (!value) return args?.siblingData?.placeholder ? true : 'Adresa este obligatorie (sau bifează „Provizoriu”).'
        return /^https?:\/\/\S+$/i.test(String(value)) ? true : 'Adresă invalidă. Exemplu: https://www.exemplu.ro'
      }) as any,
    }),
    ...contentFlags(),
  ],
}

/** Pagini legale (content-model 5.12). Textele vin de la juristul grupului (Q-25). */
export const LegalPages: CollectionConfig = {
  slug: 'legal-pages',
  labels: { singular: 'Pagină legală', plural: 'Pagini legale' },
  orderable: true,
  admin: { group: 'Conținut', useAsTitle: 'title', defaultColumns: ['title', 'slug', 'inFooter', 'placeholder'] },
  access: contentAccess,
  fields: [
    text({ name: 'title', label: 'Titlu', max: 60, required: true, localized: true }),
    text({
      name: 'slug',
      label: 'Adresă scurtă',
      max: 40,
      required: true,
      nt: true,
      description: 'Litere mici și cratime, de exemplu „confidentialitate”.',
      validate: ((value: unknown) =>
        typeof value === 'string' && /^[a-z0-9]+(-[a-z0-9]+)*$/.test(value)
          ? true
          : 'Doar litere mici, cifre și cratime.') as any,
    }),
    richText({ name: 'content', label: 'Conținut', required: true, localized: true, headings: true }),
    { name: 'inFooter', label: 'În footer', type: 'checkbox', defaultValue: true },
    ...contentFlags(),
  ],
}
