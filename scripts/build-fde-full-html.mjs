/**
 * Export the full FDE roadmap (10 stages, all lesson sections) to a single offline HTML file.
 * Source: frontend/src/fde/data/stages.json + content/stage-*.json
 * Run after LMS content changes: node scripts/build-fde-full-html.mjs
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const htmlPath = path.join(root, 'AI FDE Course_ Stage by Stage (2).html')
const fdeData = path.join(root, 'frontend/src/fde/data')
const stagesPath = path.join(fdeData, 'stages.json')
const contentDir = path.join(fdeData, 'content')

const TYPE_LABEL = {
  read: 'Read',
  lab: 'Lab',
  interview: 'Interview',
  project: 'Project',
  capstone: 'Capstone',
}

const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

function inline(text) {
  return esc(text)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2">$1</a>')
}

function mdToHtml(src = '') {
  const lines = String(src).replace(/\r\n/g, '\n').split('\n')
  const out = []
  let para = []
  let list = null

  const flushPara = () => {
    if (para.length) out.push(`<p>${inline(para.join(' '))}</p>`)
    para = []
  }
  const flushList = () => {
    if (list) out.push(`<${list.tag}>${list.items.map((x) => `<li>${inline(x)}</li>`).join('')}</${list.tag}>`)
    list = null
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (/^```/.test(line.trim())) {
      flushPara()
      flushList()
      const code = []
      for (i++; i < lines.length && !/^```/.test(lines[i].trim()); i++) code.push(lines[i])
      out.push(`<pre><code>${esc(code.join('\n'))}</code></pre>`)
      continue
    }
    if (!line.trim()) {
      flushPara()
      flushList()
      continue
    }
    const heading = line.match(/^(#{2,4})\s+(.+)$/)
    if (heading) {
      flushPara()
      flushList()
      out.push(`<h5>${inline(heading[2])}</h5>`)
      continue
    }
    const bullet = line.match(/^\s*[-*]\s+(.+)$/)
    const numbered = line.match(/^\s*\d+\.\s+(.+)$/)
    if (bullet || numbered) {
      flushPara()
      const tag = bullet ? 'ul' : 'ol'
      if (list && list.tag !== tag) flushList()
      if (!list) list = { tag, items: [] }
      list.items.push((bullet || numbered)[1])
      continue
    }
    if (list) flushList()
    para.push(line.trim())
  }
  flushPara()
  flushList()
  return out.join('')
}

const roadmap = JSON.parse(fs.readFileSync(stagesPath, 'utf8'))
const S = []
const C = {}

roadmap.stages.forEach((stage, si) => {
  const items = [...(stage.reads || []), ...(stage.practise || [])]
  const cn = `c${si + 1}`
  const color = stage.color || '#2563d6'
  const r = []

  items.forEach((item, ii) => {
    const id = `s${si + 1}-${ii}`
    const type = TYPE_LABEL[item.type] || item.type
    r.push([type, item.title, item.minutes])

    const contentPath = path.join(contentDir, `stage-${String(si + 1).padStart(2, '0')}.json`)
    let blob = {}
    if (fs.existsSync(contentPath)) {
      const all = JSON.parse(fs.readFileSync(contentPath, 'utf8'))
      blob = all[`${stage.slug}/${item.slug}`] || {}
    }

    const extras = blob.typeExtras || {}
    C[id] = {
      summary: blob.summary || item.title,
      sections: (blob.sections || []).map((sec) => ({ heading: sec.heading, html: mdToHtml(sec.body) })),
      objectives: extras.objectives || [],
      checkpointQuestions: extras.checkpointQuestions || [],
    }
  })

  S.push({
    c: cn,
    col: color,
    n: `${si + 1}. ${stage.name}`,
    nm: `Stage ${si + 1}: ${stage.name}`,
    st: `Stage ${si + 1} · ${stage.name}`,
    meta: `${stage.weeksLabel} · ${Math.round(stage.hours)} hour${Math.round(stage.hours) === 1 ? '' : 's'}`,
    d: stage.description || stage.cardBlurb || '',
    can: stage.outcomes || [],
    ready: stage.readyWhen || '',
    r,
  })
})

const totalHours = roadmap.stages.reduce((a, s) => a + (s.hours || 0), 0)
const stageCount = roadmap.stages.length

const cssExtra = roadmap.stages
  .map((s, i) => `.c${i + 1}{--a:${s.color || '#2563d6'};border-color:${s.color || '#2563d6'}}`)
  .join('')

const html = `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>AI FDE Course: Stage by Stage</title>
<style>
:root{--bg:#f6f8fb;--card:#fff;--fg:#17202e;--mut:#5d6a7c;--line:#d9e0ea;--c1:#0c9b6a;--c2:#2563d6;--lnk:#2563d6;box-sizing:border-box;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#090d16;--card:#0f1626;--fg:#e8ecf4;--mut:#8f9bb0;--line:#243047;--c1:#34d399;--c2:#5b9cf5;--lnk:#5b9cf5}}
:root[data-theme="dark"]{--bg:#090d16;--card:#0f1626;--fg:#e8ecf4;--mut:#8f9bb0;--line:#243047;--c1:#34d399;--c2:#5b9cf5;--lnk:#5b9cf5}
html{scroll-padding-top:env(safe-area-inset-top,0px)}
body{margin:0;background:var(--bg);color:var(--fg);font:15px/1.6 -apple-system,"Segoe UI",Inter,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased}
main{max-width:820px;margin:0 auto;padding:32px 18px 64px}
a{color:var(--lnk);text-decoration:none}a:hover{text-decoration:underline}
h1{font-size:1.9rem;font-weight:700;letter-spacing:-.01em;line-height:1.2;margin:0 0 8px}.sub{color:var(--mut);margin:0 0 28px}
.card{background:var(--card);border:1px solid var(--line);border-left-width:4px;border-radius:12px;padding:22px 24px;margin-bottom:20px}
.c1{--a:var(--c1);border-left-color:var(--c1)}.c2{--a:var(--c2);border-left-color:var(--c2)}
${cssExtra}
h2{font-size:1.2rem;font-weight:700;letter-spacing:-.01em;color:var(--a);margin:0}.meta{color:var(--mut);font-size:.82rem;margin:4px 0 10px;font-variant-numeric:tabular-nums}
.bar{height:5px;border-radius:3px;background:var(--line);margin-bottom:14px;max-width:260px;overflow:hidden}.bar i{display:block;height:100%;background:var(--a)}
.card>p{margin:0 0 4px;font-size:.94rem;line-height:1.65}
h3{font-size:.7rem;font-weight:600;letter-spacing:.09em;text-transform:uppercase;color:var(--mut);margin:22px 0 10px}
ul{list-style:none;margin:0;padding:0}.can li,.pts li{padding-left:16px;position:relative;font-size:.9rem;line-height:1.6;margin-bottom:5px}.can li:before,.pts li:before{content:"";position:absolute;left:2px;top:.65em;width:5px;height:5px;border-radius:50%;background:var(--a)}
.pts li{color:var(--mut)}
.rows a{display:flex;align-items:center;gap:12px;border:1px solid var(--line);border-radius:8px;padding:9px 13px;margin-bottom:6px;font-size:.9rem;color:var(--fg)}
.rows a:hover{border-color:var(--a);background:var(--bg);text-decoration:none}.rows a.done{opacity:.6}.rows a.done .t{text-decoration:line-through}
.tag{flex:none;width:76px;text-align:center;border:1px solid var(--a);color:var(--a);border-radius:4px;padding:1px 0;font-size:.62rem;font-weight:600;letter-spacing:.08em;text-transform:uppercase}
.t{flex:1;line-height:1.4}.m{flex:none;color:var(--mut);font-size:.78rem;font-variant-numeric:tabular-nums}
.ready{margin:20px 0 0;padding-top:14px;border-top:1px solid var(--line);font-size:.88rem;line-height:1.6;color:var(--mut)}.ready strong{color:var(--fg)}
.crumb{font-size:.74rem;color:var(--mut);margin-bottom:18px}.crumb a{color:var(--mut)}.crumb a:hover{color:var(--fg)}
.d{padding:28px 30px}.d h1{font-size:1.85rem;margin:6px 0 14px}.d .lead{color:var(--mut);font-size:1.02rem;line-height:1.65;margin:0}
.d .meta .tag{display:inline-block;width:auto;padding:1px 6px;margin:0 2px}
.d h4{font-size:1.05rem;font-weight:600;letter-spacing:-.005em;margin:28px 0 10px;padding-top:22px;border-top:1px solid var(--line);color:var(--fg)}
.prose{font-size:.94rem;line-height:1.7;color:var(--mut);overflow-wrap:anywhere}
.prose p{margin:0 0 12px}.prose>:last-child{margin-bottom:0}.prose strong{color:var(--fg);font-weight:600}
.prose h5{font-size:.95rem;font-weight:600;color:var(--fg);margin:20px 0 8px}
.prose ul{list-style:disc;margin:0 0 12px;padding-left:22px}.prose ol{list-style:decimal;margin:0 0 12px;padding-left:22px}
.prose li{margin:5px 0;padding-left:3px}.prose li::marker{color:var(--mut)}.prose ol>li::marker{font-weight:600}
.prose code{font:.85em ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;color:var(--fg);background:var(--bg);border:1px solid var(--line);border-radius:4px;padding:1px 5px}
.prose pre{background:var(--bg);border:1px solid var(--line);border-radius:8px;padding:13px 15px;margin:14px 0;overflow-x:auto;line-height:1.55}
.prose pre code{display:block;font-size:.8rem;white-space:pre;background:none;border:0;padding:0}
.extras{margin-top:28px;padding-top:4px;border-top:1px solid var(--line)}
.btn{padding:9px 16px;border:1px solid var(--line);background:transparent;color:var(--fg);border-radius:8px;font:inherit;font-size:.86rem;font-weight:500;cursor:pointer}
.btn:hover{border-color:var(--c1)}.btn.on{background:var(--c1);border-color:var(--c1);color:#04210f}
.foot{margin-top:32px;padding-top:22px;border-top:1px solid var(--line)}
.nav{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:20px;font-size:.88rem}
.nav a{display:block;border:1px solid var(--line);border-radius:8px;background:var(--card);padding:11px 15px;color:var(--fg)}.nav a:hover{border-color:var(--mut);text-decoration:none}
.nav small{display:block;font-size:.66rem;letter-spacing:.08em;text-transform:uppercase;color:var(--mut);margin-bottom:3px}.nav .nx{text-align:right}
</style></head><body><main id="app"></main>
<script>
var S=${JSON.stringify(S).replace(/<\//g, '<\\/')};
var C=${JSON.stringify(C).replace(/<\//g, '<\\/')};
var L=[];S.forEach(function(s,si){s.r.forEach(function(x,i){x.id="s"+(si+1)+"-"+i;x.si=si;L.push(x)})});
var done={};try{done=JSON.parse(localStorage.getItem("fde-done")||"{}")}catch(e){}
function save(){try{localStorage.setItem("fde-done",JSON.stringify(done))}catch(e){}}
function esc(t){return String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}
function home(){var h='<h1>Stage by stage</h1><p class="sub">AI FDE course · 12 weeks · ${Math.round(totalHours)} hours · ${stageCount} stages · offline</p>';
S.forEach(function(s){var n=s.r.length,k=s.r.filter(function(x){return done[x.id]}).length;
function rows(t){return '<ul class="rows">'+s.r.filter(function(x){return t?x[0]!=="Read":x[0]==="Read"}).map(function(x){return '<li><a href="#/'+x.id+'" class="'+(done[x.id]?"done":"")+'"><span class="tag">'+x[0]+'</span><span class="t">'+esc(x[1])+'</span><span class="m">'+(done[x.id]?"✓ ":"")+x[2]+' min</span></a></li>'}).join("")+'</ul>'}
h+='<section class="card '+s.c+'"><h2>'+esc(s.n)+'</h2><p class="meta">'+s.meta+' · '+n+' items · '+k+'/'+n+' done</p><div class="bar"><i style="width:'+(n?100*k/n:0)+'%"></i></div><p>'+esc(s.d)+'</p><h3>You will be able to</h3><ul class="can">'+s.can.map(function(c){return '<li>'+esc(c)+'</li>'}).join("")+'</ul><h3>Read</h3>'+rows(0)+'<h3>Practise</h3>'+rows(1)+'<p class="ready"><strong>Ready to move on when:</strong> '+esc(s.ready)+'</p></section>'});
return h}
function detail(id){var i=L.findIndex(function(x){return x.id===id});if(i<0)return home();var x=L[i],s=S[x.si],p=L[i-1],n=L[i+1],c=C[id]||{};
function pts(a){if(!a||!a.length)return "";return '<ul class="pts">'+a.map(function(t){return '<li>'+esc(t)+'</li>'}).join("")+'</ul>'}
var body="";(c.sections||[]).forEach(function(sec){body+='<h4>'+esc(sec.heading)+'</h4><div class="prose">'+sec.html+'</div>'});
var obj=c.objectives&&c.objectives.length?'<h3>Objectives</h3>'+pts(c.objectives):"";
var chk=c.checkpointQuestions&&c.checkpointQuestions.length?'<h3>Checkpoint questions</h3>'+pts(c.checkpointQuestions):"";
var ext=obj||chk?'<div class="extras">'+obj+chk+'</div>':"";
return '<div class="crumb"><a href="#/">Roadmap</a> / '+esc(s.nm)+' / '+esc(x[1])+'</div><section class="card d '+s.c+'"><div class="meta">'+esc(s.st)+' · <span class="tag">'+x[0]+'</span> · '+x[2]+' min</div><h1>'+esc(x[1])+'</h1><p class="lead">'+esc(c.summary||x[1])+'</p>'+body+ext+'<div class="foot"><button class="btn'+(done[id]?" on":"")+'" id="dn">'+(done[id]?"Done ✓ (click to undo)":"Mark as done")+'</button></div></section><div class="nav">'+(p?'<a href="#/'+p.id+'"><small>← Previous</small>'+esc(p[1])+'</a>':"<span></span>")+(n?'<a class="nx" href="#/'+n.id+'"><small>Next →</small>'+esc(n[1])+'</a>':"<span></span>")+'</div>'}
function route(){var id=location.hash.replace("#/","");var a=document.getElementById("app");a.innerHTML=id?detail(id):home();var b=document.getElementById("dn");if(b)b.onclick=function(){if(done[id])delete done[id];else done[id]=1;save();route()};window.scrollTo(0,0)}
window.addEventListener("hashchange",route);route();
</script></body></html>
`

fs.writeFileSync(htmlPath, html, 'utf8')
const itemCount = S.reduce((a, s) => a + s.r.length, 0)
console.log(`Wrote ${htmlPath}`)
console.log(`${stageCount} stages, ${itemCount} items, ${totalHours} hours`)
