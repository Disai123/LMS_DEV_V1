import roadmapData from '../data/stages.json'
import { ASK_IT_PLAIN, READ_CONNECT, READ_FIT_HEADING, TODO_PLAIN } from './fdeNarrative'

export type ItemType = 'read' | 'lab' | 'interview' | 'project' | 'assignment' | 'capstone'

export interface RoadmapItem {
  slug: string
  type: ItemType
  title: string
  minutes: number | string
  dayRef?: string
}

export interface Stage {
  slug: string
  name: string
  icon: string
  color: string
  weeksLabel: string
  sectionLabel?: string
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

const FOUNDATION_STAGE_SLUGS = new Set(['software-engineering', 'ai-engineering'])
const CAPSTONE_STAGE_SLUG = 'capstone-fde'

function isFoundationStage(stageSlug: string): boolean {
  return FOUNDATION_STAGE_SLUGS.has(stageSlug)
}

function isCapstoneStage(stageSlug: string): boolean {
  return stageSlug === CAPSTONE_STAGE_SLUG
}
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
  const summary = `${item.title} — ${stage.name}`
  const sections: ItemSection[] = []
  const foundation = isFoundationStage(stage.slug)

  if (item.type === 'read') {
    if (isCapstoneStage(stage.slug)) {
      sections.push({
        heading: 'Overview',
        body: `${summary}\n\nThis module is part of the single e-commerce Fullstack Agentic RAG capstone. Use the sections below: what we will do and what you will learn.`,
      })
    } else if (foundation) {
      sections.push(
        {
          heading: 'Overview',
          body: `${summary}\n\nSection 1 is core skills only. The customer project (Customer support ticketing system) starts in Stage 3.`,
        },
        {
          heading: 'While you read',
          body:
            '- Summarize the idea in two sentences.\n' +
            '- Note one thing you will try in the next lab.\n' +
            '- Write one checkpoint question you could ask a peer.',
        }
      )
    } else {
      sections.push(
        {
          heading: 'Overview',
          body: `${summary}\n\n${ASK_IT_PLAIN}\n\n${READ_CONNECT}`,
        },
        {
          heading: 'While you read',
          body:
            '- Write one plain-language note you could tell a store manager.\n' +
            '- Mark one risk (security, wrong answer, cost, or delay).\n' +
            '- Note which **Todo lab** or **Customer support ticketing system assignment** comes next in this stage.',
        }
      )
    }
  } else if (item.type === 'lab') {
    sections.push({
      heading: 'Overview',
      body: foundation
        ? 'Hands-on practice with your AI tool. Use the lab panel below: copy prompts, run checkpoints, meet acceptance criteria.'
        : 'Todo tutored lab with your instructor. Open the lab panel, copy one prompt at a time, and run each checkpoint before the next.',
    })
  } else if (item.type === 'assignment') {
    sections.push(
      {
        heading: 'Overview',
        body: `${summary}\n\n${ASK_IT_PLAIN}\n\nThis is **independent work**—your tutor is not in this step.`,
      },
      {
        heading: 'What to do (on your own)',
        body:
          '1. Read **Skills from the lab** in the panel below.\n' +
          '2. Use the same prompt → check → fix loop as the Todo lab.\n' +
          '3. Save deliverables in your repo and submit per your instructor.\n' +
          '4. No full application source code is provided here—**you** generate and run code locally.',
      }
    )
  } else {
    sections.push({
      heading: 'Overview',
      body: `${summary}\n\nWork through this item and mark done when you can explain the outcome clearly.`,
    })
  }

  const typeExtras: Record<string, unknown> = {}

  if (item.type === 'read') {
    if (isCapstoneStage(stage.slug)) {
      typeExtras.objectives = [
        'Summarize what this module adds to the integrated storefront',
        'Explain one design choice in plain language',
      ]
    } else if (foundation) {
      typeExtras.objectives = [
        `Understand "${item.title}" for your own projects`,
        'Connect the idea to the foundation labs in this stage',
        'Explain one takeaway without jargon',
      ]
    } else {
      typeExtras.objectives = [
        `Understand "${item.title}" in the Customer support ticketing system customer context`,
        'Connect the idea to the Todo lab and Customer support ticketing system assignment in this stage',
        'Explain one takeaway to a non-technical teammate',
      ]
      typeExtras.checkpointQuestions = [
        'Can you explain this in two minutes without jargon?',
        'Which Todo lab skill does this feed?',
      ]
    }
  } else if (item.type === 'lab' && !foundation) {
    typeExtras.deliverables = ['Files or logs named in the lab panel', 'Notes on what transfers to Customer support ticketing system']
  } else if (item.type === 'assignment') {
    typeExtras.deliverables = ['Customer support ticketing system artifacts named in the assignment panel', 'Evidence you ran checks locally']
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

  return { summary, sections, typeExtras }
}

function sectionMentionsPath(sections: ItemSection[]): boolean {
  const blob = sections.map((s) => `${s.heading} ${s.body}`).join('\n')
  return /How this (read|lab|assignment) fits|Two apps, one method|Path\b|Course structure/i.test(blob)
}

/** Prepend a short dual-narrative block when JSON content exists but omits the path legend. */
function withNarrativePreamble(stageSlug: string, item: RoadmapItem, sections: ItemSection[]): ItemSection[] {
  if (item.type === 'lab') return sections
  if (!sections.length || sectionMentionsPath(sections)) return sections
  if (item.type === 'read' && !isFoundationStage(stageSlug) && !isCapstoneStage(stageSlug)) {
    return [
      {
        heading: READ_FIT_HEADING,
        body: `${READ_CONNECT}\n\n${ASK_IT_PLAIN}`,
      },
      ...sections,
    ]
  }
  // Labs and assignments: prompts live in the panel below — avoid repeating tutor loop on the page.
  return sections
}

export function getItemContent(stageSlug: string, itemSlug: string): ItemContent | undefined {
  const resolved = getItem(stageSlug, itemSlug)
  if (!resolved) return undefined
  const key = `${stageSlug}/${itemSlug}`
  const defaults = defaultContent(resolved.stage, resolved.item)
  const fromJson = itemContent[key]
  if (fromJson) {
    const sections = fromJson.sections?.length ? fromJson.sections : defaults.sections
    return {
      ...defaults,
      ...fromJson,
      sections: withNarrativePreamble(stageSlug, resolved.item, sections),
      typeExtras: fromJson.typeExtras || defaults.typeExtras,
    }
  }
  return defaults
}

export function itemContentKey(stageSlug: string, itemSlug: string): string {
  return `${stageSlug}/${itemSlug}`
}
