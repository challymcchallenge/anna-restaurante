import type { CollectionConfig } from 'payload'

import { adminOnly, adminOnlyField, adminOrSelf, ROLES } from '../access/roles'

/** Utilizatori (content-model G2, D-16). */
export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Utilizator', plural: 'Utilizatori' },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['name', 'email', 'role'],
  },
  auth: true,
  access: {
    read: adminOrSelf,
    create: adminOnly,
    update: adminOrSelf,
    delete: adminOnly,
  },
  hooks: {
    beforeChange: [
      // Primul cont creat în panou devine Administrator; altfel nimeni nu ar putea administra.
      async ({ data, operation, req }) => {
        if (operation === 'create') {
          const { totalDocs } = await req.payload.count({ collection: 'users', req })
          if (totalDocs === 0) data.role = 'administrator'
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'name',
      label: 'Nume',
      type: 'text',
      maxLength: 60,
    },
    {
      name: 'role',
      label: 'Rol',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      saveToJWT: true,
      options: ROLES.map((value) => ({
        value,
        label: value === 'administrator' ? 'Administrator' : 'Editor',
      })),
      access: {
        // Doar Administratorul schimbă rolurile.
        create: adminOnlyField,
        update: adminOnlyField,
      },
    },
    {
      name: 'active',
      label: 'Activ',
      type: 'checkbox',
      defaultValue: true,
      access: { update: adminOnlyField },
    },
  ],
}
