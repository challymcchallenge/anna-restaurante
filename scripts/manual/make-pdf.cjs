const { chromium } = require('/opt/node22/lib/node_modules/playwright')
const path = require('path')
const footer = `<div style="width:100%;font-family:Arial,Helvetica,sans-serif;font-size:7.5pt;color:#6B5D53;text-align:center;line-height:1.35;padding:0 12mm;">
  <div>100% AI Solutions &amp; Agentic Work-Flows for SMEs</div>
  <div>Made with ❤️ by BizTech Consulting SRL</div>
  <div>Alin Labau - AI Project Manager | +40 772 295 031 | www.biztech.ro</div>
  <div style="margin-top:2px;color:#8C7B6E;">Manual de utilizare · Trattoria da Vittoria · pagina <span class="pageNumber"></span> din <span class="totalPages"></span></div>
</div>`
;(async () => {
  const br = await chromium.launch()
  const page = await br.newPage()
  await page.goto('file://' + path.resolve(process.argv[2]), { waitUntil: 'load' })
  await page.evaluate(async () => { await document.fonts.ready; document.querySelectorAll('details').forEach((d) => (d.open = true)) })
  // imaginile leneșe: forțăm încărcarea
  await page.evaluate(async () => {
    const imgs = [...document.images]
    imgs.forEach((i) => { i.loading = 'eager' })
    await Promise.all(imgs.map((i) => i.complete ? null : new Promise((r) => { i.onload = r; i.onerror = r })))
  })
  await page.waitForTimeout(800)
  await page.pdf({
    path: process.argv[3], format: 'A4', printBackground: true, preferCSSPageSize: true,
    displayHeaderFooter: true, headerTemplate: '<div></div>', footerTemplate: footer,
    margin: { top: '12mm', right: '12mm', bottom: '22mm', left: '12mm' },
  })
  await br.close()
  console.log('pdf gata')
})()
