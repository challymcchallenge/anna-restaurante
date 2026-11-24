import type { Access, FieldAccess } from 'payload'

/**
 * Roluri (ADR-002, D-16):
 * - administrator: tot, toate restaurantele (Premii, Setări, Utilizatori, Restaurante, Redirecționări);
 * - editor: conținut, media, evenimente, vinuri, recenzii, FAQ; doar restaurantele atribuite.
 */
export const ROLES = ['administrator', 'editor'] as const
export type Role = (typeof ROLES)[number]

type MaybeUser = { role?: Role | null } | null | undefined

export const isAdmin = (user: MaybeUser): boolean => user?.role === 'administrator'

export const adminOnly: Access = ({ req }) => isAdmin(req.user as MaybeUser)

export const adminOnlyField: FieldAccess = ({ req }) => isAdmin(req.user as MaybeUser)

export const authenticated: Access = ({ req }) => Boolean(req.user)

/** Ascunde din meniul panoului zonele interzise Editorului. */
export const hiddenForEditors = ({ user }: { user: unknown }): boolean =>
  !isAdmin(user as MaybeUser)

/** Administratorul vede toți utilizatorii; Editorul doar contul propriu. */
export const adminOrSelf: Access = ({ req }) => {
  if (!req.user) return false
  if (isAdmin(req.user as MaybeUser)) return true
  return { id: { equals: req.user.id } }
}

/**
 * Conținut public: vizitatorul (fără cont) vede doar elementele „Activ”.
 * În panou, orice cont autentificat vede tot; pluginul multi-tenant restrânge Editorul
 * la restaurantele lui.
 */
export const activeOrAuthenticated: Access = ({ req }) => {
  if (req.user) return true
  return { active: { equals: true } }
}

/** Acces standard pentru colecțiile de conținut (Administrator și Editor). */
export const contentAccess = {
  read: activeOrAuthenticated,
  create: authenticated,
  update: authenticated,
  delete: authenticated,
}

/**
 * Zone doar pentru Administrator (Premii, Setări, Redirecționări).
 * Vizitatorul poate citi elementele active doar dacă `publicRead` este pornit
 * (site-ul public le citește oricum pe server, prin Local API).
 */
export const adminAreaAccess = ({ publicRead = false }: { publicRead?: boolean } = {}) => ({
  read: (({ req }) => {
    if (isAdmin(req.user as MaybeUser)) return true
    if (!req.user && publicRead) return { active: { equals: true } }
    return false
  }) as Access,
  create: adminOnly,
  update: adminOnly,
  delete: adminOnly,
})
