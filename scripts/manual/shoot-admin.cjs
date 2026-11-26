// Capturi pentru manual: panoul, pe copia locală (conținutul de pornire), desktop și telefon.
const fs = require('fs')
const { chromium } = require('/opt/node22/lib/node_modules/playwright')
const sharp = require('/home/user/anna-restaurante/node_modules/sharp')
const B = process.argv[2]
const OUT = process.argv[3]
const PW = fs.readFileSync(process.env.ADMIN_PW_FILE || '', 'utf8').trim() // parola contului de probă, dintr-un fișier local; niciodată în repo
fs.mkdirSync(OUT, { recursive: true })

async function save(page, name) {
  const buf = await page.screenshot({ type: 'png' })
  await sharp(buf).webp({ quality: 82 }).toFile(`${OUT}/${name}.webp`)
}
const settle = async (p, ms = 1200) => { await p.waitForLoadState('networkidle').catch(() => {}); await p.waitForTimeout(ms) }

async function login(page) {
  await page.goto(B + '/admin/login', { waitUntil: 'domcontentloaded' })
  await page.waitForSelector('input[name="email"]', { timeout: 180000 })
  await page.fill('input[name="email"]', 'proba.manual@local.test')
  await page.fill('input[name="password"]', PW)
  await page.click('button[type="submit"]')
  await page.waitForURL((u) => !u.pathname.includes('/login'), { timeout: 120000 })
}

async function run(kind, ctxOpts) {
  const br = await chromium.launch()
  const ctx = await br.newContext(ctxOpts)
  const page = await ctx.newPage()
  await page.goto(B + '/admin/login', { waitUntil: 'domcontentloaded' })
  await page.waitForSelector('input[name="email"]', { timeout: 180000 })
  await page.waitForTimeout(800)
  await save(page, `${kind}-50-login`)
  await login(page)
  const ev = await (await page.request.get(B + '/api/events?limit=1&depth=0')).json()
  const evId = ev.docs?.[0]?.id
  const settings = await (await page.request.get(B + '/api/settings?limit=1&depth=0')).json()
  const sId = settings.docs?.[0]?.id
  const home = await (await page.request.get(B + '/api/home-page?limit=1&depth=0')).json()
  const hId = home.docs?.[0]?.id
  const shots = [
    ['51-tablou', '/admin'],
    ['52-pagina-acasa', `/admin/collections/home-page/${hId}`],
    ['53-seri-lista', '/admin/collections/events'],
    ['54-seara', `/admin/collections/events/${evId}`],
    ['55-biblioteca', '/admin/collections/media'],
    ['56-biblioteca-creeaza', '/admin/collections/media/create'],
    ['57-galerie', '/admin/collections/gallery'],
    ['58-recenzii', '/admin/collections/reviews'],
    ['59-vinuri', '/admin/collections/wines'],
    ['60-intrebari', '/admin/collections/faqs'],
    ['61-saloane', '/admin/collections/salons'],
    ['62-setari', `/admin/collections/settings/${sId}`],
    ['65-cereri', '/admin/collections/submissions'],
    ['66-premii', '/admin/collections/awards'],
    ['67-redirectionari', '/admin/collections/redirects'],
    ['68-utilizatori', '/admin/collections/users'],
  ]
  for (const [name, path] of shots) {
    await page.goto(B + path, { waitUntil: 'domcontentloaded' })
    await settle(page, 1800)
    await save(page, `${kind}-${name}`)
  }
  // Setări: filele Integrări și Cereri și emailuri
  await page.goto(B + `/admin/collections/settings/${sId}`, { waitUntil: 'domcontentloaded' })
  await settle(page, 1500)
  for (const [name, tab] of [['63-setari-integrari', 'Integrări'], ['64-setari-cereri', 'Cereri și emailuri']]) {
    const t = page.locator('.tabs-field__tab-button, button[role="tab"], .tabs-field__tabs button').filter({ hasText: tab }).first()
    if (await t.count()) { await t.click(); await page.waitForTimeout(900); await save(page, `${kind}-${name}`) }
  }
  // limba conținutului (selectorul din dreapta sus)
  await page.goto(B + `/admin/collections/events/${evId}`, { waitUntil: 'domcontentloaded' })
  await settle(page, 1500)
  const loc = page.locator('.localizer button, .localizer').first()
  if (await loc.count()) { await loc.click().catch(() => {}); await page.waitForTimeout(700); await save(page, `${kind}-69-limba-continut`) }
  await br.close()
}

;(async () => {
  await run('desktop', { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1.25 })
  await run('telefon', { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true })
  console.log('gata:', fs.readdirSync(OUT).filter((f) => /-(5|6)\d-/.test(f)).length)
})()
