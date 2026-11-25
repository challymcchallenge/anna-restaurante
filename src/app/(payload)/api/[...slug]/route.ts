/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import config from '@payload-config'
import '@payloadcms/next/css'
import {
  REST_DELETE,
  REST_GET,
  REST_OPTIONS,
  REST_PATCH,
  REST_POST,
  REST_PUT,
} from '@payloadcms/next/routes'

export const GET = REST_GET(config)
export const POST = REST_POST(config)
export const DELETE = REST_DELETE(config)
export const PATCH = REST_PATCH(config)
export const PUT = REST_PUT(config)
export const OPTIONS = REST_OPTIONS(config)

// Adăugat manual (F4, D-64): o tură din „Tradu tot site-ul” durează până la ~45 s, plus citirea
// stărilor; retraducerea după salvare rulează în `after()` tot în această funcție. Dacă Payload
// regenerează fișierul, linia trebuie pusă la loc (testul f4-traduceri o verifică).
export const maxDuration = 120
