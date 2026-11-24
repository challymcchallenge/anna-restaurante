/**
 * Aplică seed/*.json pe restaurantele care nu au primit încă conținutul de pornire (F1).
 * Rulat de scripts/vercel-build.sh după `payload migrate`. Local: `pnpm payload run scripts/seed-starter.ts`.
 */
import { getPayload } from 'payload'

import config from '../src/payload.config'
import { seedStarterContent } from '../src/seed/starter'

const payload = await getPayload({ config })
const report = await seedStarterContent({ payload })
payload.logger.info(`[seed] gata: ${report.length} restaurant(e) completate.`)
process.exit(0)
