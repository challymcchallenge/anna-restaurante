import { config } from 'dotenv'

/**
 * Variabilele pentru teste: întâi .env.local, apoi .env (ca Next.js).
 * Siguranță: testele creează și șterg date, deci refuză orice bază care nu este locală.
 */
config({ path: '.env.local' })
config()

const uri = process.env.DATABASE_URI || ''
if (!/@(localhost|127\.0\.0\.1)(:\d+)?\//.test(uri)) {
  throw new Error(
    'Testele rulează doar pe o bază de date locală (DATABASE_URI cu localhost sau 127.0.0.1). Nu le rula pe producție.',
  )
}
