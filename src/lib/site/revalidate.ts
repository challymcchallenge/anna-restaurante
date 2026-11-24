import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, CollectionConfig } from 'payload'

/**
 * Golește cache-ul site-ului public după orice salvare sau ștergere din panou, ca vizitatorul să
 * vadă schimbarea la următoarea încărcare (src/lib/site/data.ts).
 *
 * `revalidateTag` merge doar într-o cerere Next (panoul, API-ul). În scripturi (conținutul de
 * pornire, migrații) nu există o astfel de cerere: atunci nu face nimic, iar cache-ul expiră singur
 * în 10 minute.
 */
const TAG = 'site'

async function revalidateSite() {
  try {
    const { revalidateTag } = await import('next/cache')
    // `{ expire: 0 }`: următoarea vizită așteaptă datele noi, în loc să primească o copie veche.
    revalidateTag(TAG, { expire: 0 })
  } catch {
    // în afara unei cereri Next (scripturi): nimic de golit
  }
}

const afterChange: CollectionAfterChangeHook = async ({ doc }) => {
  await revalidateSite()
  return doc
}

const afterDelete: CollectionAfterDeleteHook = async ({ doc }) => {
  await revalidateSite()
  return doc
}

/** Adaugă golirea cache-ului la o colecție, păstrând hook-urile ei. */
export function withSiteRevalidation(collection: CollectionConfig): CollectionConfig {
  return {
    ...collection,
    hooks: {
      ...collection.hooks,
      afterChange: [...(collection.hooks?.afterChange ?? []), afterChange],
      afterDelete: [...(collection.hooks?.afterDelete ?? []), afterDelete],
    },
  }
}
