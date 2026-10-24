import roadmapData from '../data/stages.json'

export type ItemType = 'read' | 'lab' | 'interview' | 'project' | 'capstone'

export interface RoadmapItem {
  slug: string
  type: ItemType
  title: string
  minutes: number
  dayRef?: string
}

export interface Stage {
  slug: string
  name: string
  icon: string
  color: string
  weeksLabel: string
  hours: number
  cardBlurb: string
  description: string
  outcomes: string[]
  readyWhen: string
  reads: RoadmapItem[]
  practise: RoadmapItem[]
}

export interface RoadmapData {
  hero: { eyebrow: string; title: string; subtitle: string }
  chips: string[]
  phases: { label: string; detail: string }[]
  capabilities: string[]
  faq: { question: string; answer: string }[]
  capstone: {
    title: string
    intro: string
    deliverables: string[]
    strongWork: { title: string; body: string }[]
    startStageSlug: string
    startItemSlug: string
  }
  stages: Stage[]
}

export interface ItemSection {
  heading: string
  body: string
}

export interface ItemContent {
  summary: string
  sections: ItemSection[]
  typeExtras?: Record<string, unknown>
}

export interface CurriculumEntry {
  stageSlug: string
  stageName: string
  stageColor: string
  stageIndex: number
  item: RoadmapItem
  list: 'reads' | 'practise'
}

const data = roadmapData as RoadmapData
const contentModules = import.meta.glob('../data/content/*.json', { eager: true }) as Record<
  string,
  { default: Record<string, ItemContent> }
>
const itemContent: Record<string, ItemContent> = Object.assign(
  {},
  ...Object.values(contentModules).map((m) => m.default)
)

export function getRoadmapData(): RoadmapData {
  return data
}

export function getStages(): Stage[] {
  return data.stages
}

export function getStage(slug: string): Stage | undefined {
  return data.stages.find((s) => s.slug === slug)
}

export function getStageIndex(slug: string): number {
  return data.stages.findIndex((s) => s.slug === slug)
}

export function getAllItems(stage: Stage): RoadmapItem[] {
  return [...stage.reads, ...stage.practise]
}

export function getProgressKey(stageSlug: string, itemSlug: string): string {
  return `${stageSlug}:${itemSlug}`
}

export function countTotalItems(): number {
  return data.stages.reduce((sum, s) => sum + getAllItems(s).length, 0)
}

export function getCurriculum(): CurriculumEntry[] {
  const entries: CurriculumEntry[] = []
  data.stages.forEach((stage, stageIndex) => {
    stage.reads.forEach((item) => {
      entries.push({
        stageSlug: stage.slug,
        stageName: stage.name,
        stageColor: stage.color,
        stageIndex,
        item,
        list: 'reads',
      })
    })
    stage.practise.forEach((item) => {
      entries.push({
        stageSlug: stage.slug,
        stageName: stage.name,
        stageColor: stage.color,
        stageIndex,
        item,
        list: 'practise',
      })
    })
  })
  return entries
}

export function getItem(
  stageSlug: string,
  itemSlug: string
): { stage: Stage; item: RoadmapItem; stageIndex: number } | undefined {
  const stageIndex = getStageIndex(stageSlug)
  if (stageIndex < 0) return undefined
  const stage = data.stages[stageIndex]
  const item = getAllItems(stage).find((i) => i.slug === itemSlug)
  if (!item) return undefined
  return { stage, item, stageIndex }
}

export function getAdjacentItems(
  stageSlug: string,
  itemSlug: string
): { prev?: CurriculumEntry; next?: CurriculumEntry } {
  const curriculum = getCurriculum()
  const idx = curriculum.findIndex(
    (e) => e.stageSlug === stageSlug && e.item.slug === itemSlug
  )
  if (idx < 0) return {}
  return {
    prev: idx > 0 ? curriculum[idx - 1] : undefined,
    next: idx < curriculum.length - 1 ? curriculum[idx + 1] : undefined,
  }
}

function defaultContent(stage: Stage, item: RoadmapItem): ItemContent {
  const base = `${item.title} — part of **${stage.name}** in the FDE roadmap.`
  const sections: ItemSection[] = [
    {
      heading: 'Overview',
      body: `${base}\n\nUse this ${item.type} to build customer-ready FDE skills. Take notes as you go; mark done when you have completed the work or can explain it clearly to a stakeholder.`,
    },
  ]

  const typeExtras: Record<string, unknown> = {}

  if (item.type === 'read') {
    sections.push({
      heading: 'Key ideas',
      body:
        '- Connect concepts to a real customer workflow\n' +
        '- Note constraints: data, security, latency, cost\n' +
        '- Write one sentence on how you would explain this to a non-technical sponsor',
    })
    typeExtras.objectives = [
      `Understand the core ideas behind "${item.title}"`,
      'Relate the topic to forward-deployed customer work',
      'Identify one risk or assumption to validate in discovery',
    ]
    typeExtras.checkpointQuestions = [
      'Can you explain this in two minutes without jargon?',
      'What would you verify on a customer project before relying on this?',
    ]
  } else if (item.type === 'lab') {
    sections.push({
      heading: 'Lab approach',
      body:
        '1. Define a minimal success criterion\n' +
        '2. Build the smallest slice that proves the idea\n' +
        '3. Document what you would harden for production',
    })
    typeExtras.prerequisites = ['Local dev environment', 'Stage reads for this topic completed or skimmed']
    typeExtras.steps = [
      'Set up the repo or sandbox',
      'Implement the core path end-to-end',
      'Run a quick manual test and capture screenshots or notes',
      'List production gaps (auth, monitoring, evals)',
    ]
    typeExtras.deliverables = ['Working slice or wireframes', 'Short README or demo notes']
  } else if (item.type === 'interview') {
    typeExtras.prompt = item.title
    typeExtras.howToApproach = [
      'Clarify stakeholders and constraints before proposing solutions',
      'Structure answer: context → options → recommendation → risks',
      'Mention trade-offs and what you would validate in week one',
    ]
    typeExtras.rubric = [
      'Shows structured thinking under ambiguity',
      'Names risks (data, security, scope, accuracy)',
      'Proposes a concrete next step the customer can approve',
    ]
  } else if (item.type === 'project' || item.type === 'capstone') {
    typeExtras.scope =
      'Deliver a demonstrable artifact aligned to the stage outcomes, with honest evaluation of gaps.'
    typeExtras.milestones = [
      'Discovery and scope sign-off (even if synthetic customer)',
      'Core implementation',
      'Evaluation or demo script',
      'Handover notes',
    ]
    typeExtras.acceptanceCriteria = [
      'Runnable demo or documented prototype',
      'Clear list of production gaps',
      'Evidence of testing or eval on representative data',
    ]
  }

  return { summary: base, sections, typeExtras }
}

export function getItemContent(stageSlug: string, itemSlug: string): ItemContent | undefined {
  const resolved = getItem(stageSlug, itemSlug)
  if (!resolved) return undefined
  const key = `${stageSlug}/${itemSlug}`
  const defaults = defaultContent(resolved.stage, resolved.item)
  const fromJson = itemContent[key]
  if (fromJson) {
    return {
      ...defaults,
      ...fromJson,
      sections: fromJson.sections?.length ? fromJson.sections : defaults.sections,
      typeExtras: fromJson.typeExtras || defaults.typeExtras,
    }
  }
  return defaults
}

export function itemContentKey(stageSlug: string, itemSlug: string): string {
  return `${stageSlug}/${itemSlug}`
}
