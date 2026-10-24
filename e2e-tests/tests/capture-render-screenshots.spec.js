/**
 * Capture screenshots from Antigravity Render demos into Realtime_projects folders.
 * Run: npx playwright test tests/capture-render-screenshots.spec.js --project=chromium
 */
const { test } = require('@playwright/test')
const fs = require('fs')
const path = require('path')

const root = path.join(__dirname, '..', '..', 'Realtime_projects')

const TARGETS = [
  {
    folder: 'Antigravity_Ecommerce_Fullstack',
    baseUrl: 'https://ecommerce-frontend-project.onrender.com',
    shots: [{ name: 'home.png', path: '/' }, { name: 'products.png', path: '/products' }, { name: 'cart.png', path: '/cart' }],
  },
  {
    folder: 'Antigravity_Ecommerce_Single_Agent',
    baseUrl: 'https://ecommerce-single-agent-fastapi-frontend.onrender.com',
    shots: [{ name: 'home.png', path: '/' }, { name: 'agent_chat.png', path: '/' }],
  },
  {
    folder: 'Antigravity_Ecommerce_Multi_Agent',
    baseUrl: 'https://ecommerce-multi-agent-fastapi-frontend.onrender.com',
    shots: [{ name: 'home.png', path: '/' }, { name: 'agent_chat.png', path: '/' }],
  },
  {
    folder: 'Antigravity_Ecommerce_Agentic_RAG',
    baseUrl: 'https://agentic-rag-fastapi-frontend.onrender.com',
    shots: [{ name: 'home.png', path: '/' }, { name: 'rag_answer.png', path: '/' }],
  },
]

test.describe.configure({ mode: 'serial' })

for (const target of TARGETS) {
  test(`screenshots ${target.folder}`, async ({ page }) => {
    test.setTimeout(180000)
    const outDir = path.join(root, target.folder, 'screenshots')
    fs.mkdirSync(outDir, { recursive: true })

    for (const shot of target.shots) {
      const url = target.baseUrl + shot.path
      try {
        await page.goto(url, { waitUntil: 'networkidle', timeout: 120000 })
        await page.waitForTimeout(3000)
        await page.screenshot({ path: path.join(outDir, shot.name), fullPage: false })
      } catch (e) {
        console.warn('Shot failed', url, e.message)
        await page.goto(target.baseUrl, { waitUntil: 'domcontentloaded', timeout: 120000 })
        await page.waitForTimeout(5000)
        await page.screenshot({ path: path.join(outDir, shot.name), fullPage: false })
      }
    }

    const home = path.join(outDir, 'home.png')
    const thumb = path.join(root, target.folder, 'thumbnail.png')
    if (fs.existsSync(home)) fs.copyFileSync(home, thumb)
  })
}
