export const fence = (text) => '```\n' + text.trim() + '\n```'

const SECTION_ORDER = [
  ['explain', 'Overview'],
  ['why', 'Why it matters'],
  ['example', 'Example: Retail case'],
  ['steps', 'Procedure'],
  ['mistakes', 'Pitfalls'],
  ['template', 'Template'],
]

function bodyText(value) {
  if (typeof value === 'string') return value.trim()
  if (Array.isArray(value)) return value.map((x) => `- ${x}`).join('\n')
  return String(value).trim()
}

export function lessonSections(lesson = {}) {
  const sections = []
  for (const [key, heading] of SECTION_ORDER) {
    if (lesson[key]) sections.push({ heading, body: bodyText(lesson[key]) })
  }
  for (const extra of lesson.extra || []) sections.push({ heading: extra.heading, body: bodyText(extra.body) })
  return sections
}
