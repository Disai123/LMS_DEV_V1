import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rt = path.join(__dirname, '../Realtime_projects')

const AGENT_NAV_BLOCK = /\s*<button class="phase-nav-btn"[^>]*data-phase="agent-skills"[\s\S]*?<\/button>\s*/g

const folders = fs.readdirSync(rt).filter((f) => f.startsWith('Antigravity_'))

for (const folder of folders) {
  const root = path.join(rt, folder)
  const agentDir = path.join(root, 'Agent_Skills_phase')
  if (fs.existsSync(agentDir)) {
    fs.rmSync(agentDir, { recursive: true, force: true })
    console.log('Removed', agentDir)
  }

  const walk = (dir) => {
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, ent.name)
      if (ent.isDirectory()) walk(p)
      else if (ent.name === 'Overview.html') {
        let html = fs.readFileSync(p, 'utf8')
        if (html.includes('data-phase="agent-skills"')) {
          html = html.replace(AGENT_NAV_BLOCK, '\n')
          fs.writeFileSync(p, html, 'utf8')
          console.log('Patched phase nav:', p)
        }
      }
    }
  }
  walk(root)

  const navPath = path.join(root, 'shared', 'navigation.js')
  if (fs.existsSync(navPath)) {
    let js = fs.readFileSync(navPath, 'utf8')
    if (js.includes("'agent-skills'")) {
      js = js.replace(/\s*'agent-skills': \[\s[\s\S]*?\],\s*/m, '\n')
      js = js.replace(/\s*'agent-skills': 'Agent_Skills_phase',\s*/g, '')
      js = js.replace(
        /} else if \(this\.currentPhase === 'agent-skills' && isLastSubphase\) {[\s\S]*?} else {/,
        ' } else {'
      )
      js = js.replace(
        /if \(this\.currentPhase === 'agent-skills' && isLastSubphase\) {[\s\S]*?return;\s*}\s*\n\s*if \(!isLastSubphase\)/,
        'if (!isLastSubphase)'
      )
      js = js.replace(
        /span\.textContent = this\.currentPhase === 'agent-skills' \? 'Next Agent' : 'Next Step';/g,
        "span.textContent = 'Next Step';"
      )
      fs.writeFileSync(navPath, js, 'utf8')
      console.log('Patched navigation.js:', folder)
    }
  }

  const indexPath = path.join(root, 'index.html')
  if (fs.existsSync(indexPath)) {
    let html = fs.readFileSync(indexPath, 'utf8')
    html = html.replace(/Agent_Skills_phase\/Overview\.html/g, 'BRD_phase/Overview.html')
    fs.writeFileSync(indexPath, html, 'utf8')
    console.log('Patched index journey link:', folder)
  }
}

console.log('Done.')
