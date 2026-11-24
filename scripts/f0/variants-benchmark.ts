/**
 * F0 · imagini: generarea variantelor AVIF/WebP pe server, măsurată local.
 * Rulare: taskset -c 0 pnpm tsx scripts/f0/variants-benchmark.ts <master.jpg> [sequential|parallel]
 * (taskset -c 0 = un singur nucleu, ca o funcție Vercel implicită de 1 vCPU)
 */
import fs from 'node:fs'

import sharp from 'sharp'

import { runVariantsBenchmark } from '../../src/lib/media/variants-benchmark'

const [file, mode = 'sequential'] = process.argv.slice(2)
if (process.env.SHARP_CONCURRENCY) sharp.concurrency(Number(process.env.SHARP_CONCURRENCY))
const result = await runVariantsBenchmark(fs.readFileSync(file), mode as 'sequential' | 'parallel')
console.log(JSON.stringify(result))
