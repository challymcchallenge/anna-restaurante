import type { CollectionConfig } from 'payload'

/**
 * Biblioteca media (content-model 6, ADR-004, ADR-005). Formă minimă pentru F0;
 * conversia în browser, punctul focal și variantele AVIF/WebP vin din testele F0 și în F1.
 */
export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Fișier media', plural: 'Bibliotecă media' },
  access: {
    // Fișierele sunt publice pe site; pluginul multi-tenant restrânge panoul pe restaurant.
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      label: 'Text alternativ',
      type: 'text',
      required: true,
      maxLength: 140,
    },
  ],
  upload: true,
}
