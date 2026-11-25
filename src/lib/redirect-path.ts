/**
 * Adresa veche normalizată (F5, G7-2): litere mici, fără „/” la final, cu „/” la început.
 * Folosită la salvare (panou → Redirecționări) și la căutare, ca `/Gallery/Locatie/` și
 * `/gallery/locatie` să fie aceeași adresă.
 */
export function normalizeOldPath(path: string): string {
  const p = `/${path.trim().replace(/^\/+/, '')}`.toLowerCase()
  return p.length > 1 ? p.replace(/\/+$/, '') : p
}
