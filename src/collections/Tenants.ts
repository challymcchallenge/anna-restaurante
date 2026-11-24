import type { CollectionConfig } from 'payload'

import { adminOnly, authenticated } from '../access/roles'

/**
 * Restaurante (content-model G1, ADR-002). Fiecare restaurant este un tenant.
 * Câmpurile de identitate, contact și integrări (R1–R3) se adaugă în F1.
 */
export const Tenants: CollectionConfig = {
  slug: 'tenants',
  labels: { singular: 'Restaurant', plural: 'Restaurante' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'domain', 'active'],
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
  ],
}
