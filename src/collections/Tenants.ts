import type { CollectionConfig } from 'payload'

import { adminOnly, authenticated, hiddenForEditors } from '../access/roles'

/**
 * Restaurante (content-model G1, ADR-002). Fiecare restaurant este un tenant.
 * Identitatea, contactul și integrările (R1–R4) stau în colecția „Setări restaurant”.
 */
export const Tenants: CollectionConfig = {
  slug: 'tenants',
  labels: { singular: 'Restaurant', plural: 'Restaurante' },
  // Ordinea din comutatorul de restaurant: se schimbă prin tragere în listă.
  // Implicit, ordinea creării (primul restaurant = cel ales după autentificare, nu primul alfabetic).
  orderable: true,
  admin: {
    group: 'Administrare',
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'domain', 'active'],
    hidden: hiddenForEditors,
  },
  access: {
    // Pluginul multi-tenant restrânge citirea la restaurantele atribuite (Editor).
    read: authenticated,
    create: adminOnly,
    update: adminOnly,
    delete: adminOnly,
  },
  fields: [
    {
      name: 'name',
      label: 'Nume',
      type: 'text',
      required: true,
      maxLength: 60,
    },
    {
      name: 'slug',
      label: 'Identificator scurt',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      maxLength: 30,
      admin: { description: 'Litere mici și cratime; nu se schimbă după creare.' },
      validate: (value: string | null | undefined) =>
        !value || /^[a-z0-9]+(-[a-z0-9]+)*$/.test(value) || 'Doar litere mici, cifre și cratime.',
    },
    {
      name: 'domain',
      label: 'Domeniu',
      type: 'text',
      admin: {
        description:
          'Gol până la legarea domeniului (D-20). Exemplu: davittoria.ro, fără https://.',
      },
    },
    {
      // [PRESUPUNERE] Lista de adrese pe care se servește site-ul restaurantului:
      // adresa temporară Vercel acum, domeniul (și www) după lansare.
      name: 'hosts',
      label: 'Adrese pe care se servește site-ul',
      type: 'array',
      admin: {
        description:
          'Numele de gazdă, fără https:// și fără cale. Exemplu: anna-restaurante-xyz.vercel.app',
      },
      fields: [{ name: 'host', label: 'Adresă', type: 'text', required: true }],
    },
    {
      name: 'allowIndexing',
      label: 'Indexare de către Google',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Oprită până la legarea domeniului (ADR-012).' },
    },
    {
      name: 'active',
      label: 'Activ',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'starterContentAt',
      label: 'Conținut de pornire aplicat la',
      type: 'date',
      admin: {
        readOnly: true,
        position: 'sidebar',
        description: 'Completat automat, o singură dată, din seed/<identificator>.json. Gol = nu s-a aplicat.',
        date: { pickerAppearance: 'dayAndTime' },
      },
    },
  ],
}
