/**
 * URL-ul public al fișierelor din Supabase Storage (actualizarea ADR-003 după F0):
 * site-ul servește fișierele direct din bucket-ul public, nu prin funcția Vercel.
 *
 * Din endpoint-ul S3 (`https://<ref>.storage.supabase.co/storage/v1/s3`) se obține
 * `https://<ref>.storage.supabase.co/storage/v1/object/public/<bucket>`.
 * Nu cere o variabilă nouă de mediu.
 */
export function supabasePublicBase(endpoint: string | undefined, bucket: string | undefined): string | null {
  if (!endpoint || !bucket) return null
  const trimmed = endpoint.replace(/\/+$/, '')
  if (!/\/storage\/v1\/s3$/.test(trimmed)) return null
  return `${trimmed.replace(/\/s3$/, '/object/public')}/${encodeURIComponent(bucket)}`
}

export function publicFileUrl(base: string, filename: string, prefix?: string | null): string {
  const key = [prefix, filename]
    .filter(Boolean)
    .map((part) => String(part).split('/').map(encodeURIComponent).join('/'))
    .join('/')
  return `${base}/${key}`
}
