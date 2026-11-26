// Capturi pentru manual: site-ul public de pe producție, desktop (1440 × 900) și telefon (390 × 844).
const fs = require('fs')
const { chromium } = require('/opt/node22/lib/node_modules/playwright')
const sharp = require('/home/user/anna-restaurante/node_modules/sharp')
const B = process.argv[2]
const OUT = process.argv[3]
fs.mkdirSync(OUT, { recursive: true })
const CONSENT = JSON.stringify({ choice: 'denied', at: Date.now() })

async function save(page, name) {
  const buf = await page.screenshot({ type: 'png' })
  await sharp(buf).webp({ quality: 82 }).toFile(`${OUT}/${name}.webp`)
}
async function settle(page, ms = 900) {
  await page.waitForLoadState('networkidle').catch(() => {})
  await page.waitForTimeout(ms)
}
async function scrollTo(page, id) {
  await page.evaluate((id) => {
    const el = document.getElementById(id) || document.querySelector(id)
    if (!el) return false
    document.documentElement.classList.add('cv-all')
    el.scrollIntoView({ behavior: 'instant', block: 'start' })
    return true
  }, id)
  await page.waitForTimeout(1200)
}
async function pauseHero(page) {
  await page.locator('.hero button[aria-pressed]').first().click({ timeout: 2000 }).catch(() => {})
}

async function run(kind, ctxOpts) {
  const br = await chromium.launch()
  const ctx = await br.newContext(ctxOpts)
  const page = await ctx.newPage()
  const shots = {}
  const log = (k, v) => (shots[k] = v)

  // 00 · bannerul de cookies (fără alegere salvată)
  await page.goto(B + '/', { waitUntil: 'domcontentloaded' })
  await settle(page, 2500)
  await pauseHero(page)
  await save(page, `${kind}-00-cookies`)
  await page.locator('[data-cookie-banner] button').first().click().catch(() => {})
  await page.waitForTimeout(600)
  // de aici încolo: acordul refuzat, ca bannerul să nu acopere
  await ctx.addInitScript((c) => { try { localStorage.setItem('cookies-consent', c) } catch {} }, CONSENT)

  await page.goto(B + '/', { waitUntil: 'domcontentloaded' })
  await settle(page, 2500)
  await pauseHero(page)
  await save(page, `${kind}-01-acasa`)
  const sections = ['cazare', 'bucataria', 'vinuri', 'recenzii', 'petreceri', 'evenimente-private', 'cursuri-pizza', 'hotel', 'galerie', 'contact']
  let i = 2
  for (const s of sections) {
    const ok = await page.evaluate((id) => !!document.getElementById(id), s)
    if (!ok) { log(s, 'lipsă'); continue }
    await scrollTo(page, s)
    await save(page, `${kind}-${String(i).padStart(2, '0')}-${s}`)
    i++
  }
  // întrebările (ultima secțiune de FAQ de pe Acasă) și footer-ul
  await scrollTo(page, '.faq-list, .faq, [class*="faq"]')
  await save(page, `${kind}-12-intrebari`)
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  await page.waitForTimeout(1200)
  await save(page, `${kind}-13-footer`)

  // meniul (telefon: panoul lateral; desktop: „Mai mult”)
  await page.goto(B + '/', { waitUntil: 'domcontentloaded' })
  await settle(page, 2000)
  await pauseHero(page)
  if (kind === 'telefon') {
    await page.locator('[data-nav-open]:visible').first().tap({ timeout: 4000 }).catch(() => {})
  } else {
    const more = page.locator('.nav-more:visible').first()
    if (await more.count()) await more.click()
  }
  await page.waitForTimeout(700)
  await save(page, `${kind}-14-meniu`)
  await page.keyboard.press('Escape').catch(() => {})

  // selectorul de limbă
  await page.goto(B + '/', { waitUntil: 'domcontentloaded' })
  await settle(page, 1500)
  await pauseHero(page)
  const lang = page.locator('header details.lang summary, header .lang summary, header summary').first()
  if (await lang.count()) { await lang.click({ timeout: 4000 }).catch(() => {}); await page.waitForTimeout(500); await save(page, `${kind}-15-limba`) }

  // bara de cazare: calendarul
  await page.goto(B + '/', { waitUntil: 'domcontentloaded' })
  await settle(page, 1500)
  await pauseHero(page)
  const arrive = page.locator('.stay button').first()
  if (await arrive.count()) { await arrive.click().catch(() => {}); await page.waitForTimeout(700); await save(page, `${kind}-16-cazare-calendar`) }
  await page.keyboard.press('Escape').catch(() => {})

  // ialoc
  await page.goto(B + '/', { waitUntil: 'domcontentloaded' })
  await settle(page, 1500)
  await pauseHero(page)
  await page.locator('.hero button:has-text("Rezervă o masă"), .hero a:has-text("Rezervă o masă")').first().click().catch(() => {})
  await page.waitForTimeout(6000)
  await save(page, `${kind}-17-ialoc`)

  // paginile proprii
  const pages = [
    ['18-petreceri', '/petreceri'], ['19-evenimente-private', '/evenimente-private'], ['20-cursuri-pizza', '/cursuri-pizza-copii'],
    ['21-galerie', '/galerie'], ['23-catalog-vinuri', '/catalog-vinuri'], ['26-contact', '/contact'], ['27-contact-cazare', '/contact?subiect=cazare'],
    ['29-sesizari', '/formular-de-reclamatie'], ['30-termeni', '/termeni'], ['31-cookies', '/cookies'], ['32-en', '/en'], ['33-zh-vinuri', '/zh/catalog-vinuri'], ['34-it-petreceri', '/it/petreceri'],
  ]
  for (const [name, path] of pages) {
    await page.goto(B + path, { waitUntil: 'domcontentloaded' })
    await settle(page, 1800)
    await pauseHero(page)
    await save(page, `${kind}-${name}`)
  }
  // galeria: fereastra mare
  await page.goto(B + '/galerie', { waitUntil: 'domcontentloaded' })
  await settle(page, 1800)
  const tile = page.locator('.gal-item a, .gal-item button').first()
  if (await tile.count()) { await tile.click({ timeout: 4000 }).catch(() => {}); await page.waitForTimeout(1200); await save(page, `${kind}-22-galerie-fereastra`); await page.keyboard.press('Escape').catch(() => {}) }
  // lista de vinuri: căutare
  await page.goto(B + '/catalog-vinuri', { waitUntil: 'domcontentloaded' })
  await settle(page, 1500)
  const search = page.locator('input[type="search"], input[name="q"]').first()
  if (await search.count()) { await search.fill('barolo').catch(() => {}); await page.waitForTimeout(900); await save(page, `${kind}-24-vinuri-cautare`) }
  await page.goto(B + '/catalog-vinuri', { waitUntil: 'domcontentloaded' })
  await settle(page, 1500)
  const red = page.locator('.chip-filter label:has-text("Roșu"), label:has-text("Roșu")').first()
  if (await red.count()) { await red.scrollIntoViewIfNeeded().catch(() => {}); await red.click({ timeout: 4000, force: true }).catch(() => {}); await page.waitForTimeout(900); await save(page, `${kind}-25-vinuri-filtru`) }
  // contact: greșelile și harta
  await page.goto(B + '/contact?subiect=eveniment-privat', { waitUntil: 'domcontentloaded' })
  await settle(page, 1500)
  const submit = page.locator('form button[type="submit"]').last()
  if (await submit.count()) { await submit.click().catch(() => {}); await page.waitForTimeout(1200); await save(page, `${kind}-28-contact-erori`) }
  await page.goto(B + '/contact', { waitUntil: 'domcontentloaded' })
  await settle(page, 1500)
  const map = page.locator('button:has-text("Arată harta")').first()
  if (await map.count()) { await map.scrollIntoViewIfNeeded().catch(() => {}); await map.click({ timeout: 4000 }).catch(() => {}); await page.waitForTimeout(4000); await save(page, `${kind}-35-harta`) }
  fs.writeFileSync(`${OUT}/${kind}-log.json`, JSON.stringify(shots))
  await br.close()
}

;(async () => {
  const only = process.argv[4]
  if (!only || only === 'desktop') await run('desktop', { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1.25 })
  if (!only || only === 'telefon') await run('telefon', { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1' })
  console.log('gata:', fs.readdirSync(OUT).length)
})()
