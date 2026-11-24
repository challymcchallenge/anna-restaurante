import type { Access, FieldAccess } from 'payload'

/**
 * Roluri (ADR-002, D-16):
 * - administrator: tot, toate restaurantele (Premii, Setări, Utilizatori, Restaurante);
 * - editor: conținut, media, evenimente, recenzii; doar restaurantele atribuite.
 */
export const ROLES = ['administrator', 'editor'] as const
export type Role = (typeof ROLES)[number]

type MaybeUser = { role?: Role | null } | null | undefined

export const isAdmin = (user: MaybeUser): boolean => user?.role === 'administrator'

export const adminOnly: Access = ({ req }) => isAdmin(req.user as MaybeUser)

export const adminOnlyField: FieldAccess = ({ req }) => isAdmin(req.user as MaybeUser)

export const authenticated: Access = ({ req }) => Boolean(req.user)

/** Administratorul vede toți utilizatorii; Editorul doar contul propriu. */
export const adminOrSelf: Access = ({ req }) => {
  if (!req.user) return false
  if (isAdmin(req.user as MaybeUser)) return true
  return { id: { equals: req.user.id } }
}
