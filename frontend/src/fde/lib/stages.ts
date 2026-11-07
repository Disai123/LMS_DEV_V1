import roadmapData from '../data/stages.json'
import {
  ASK_IT_PLAIN,
  ASSIGNMENT_FIT_HEADING,
  HOW_COURSE_WORKS,
  LAB_FIT_HEADING,
  READ_CONNECT,
  READ_FIT_HEADING,
  TODO_PLAIN,
} from './fdeNarrative'

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

  if (item.type === 'read') {
    sections.push(
      {
        heading: 'Overview',
        body: `${summary}\n\n${ASK_IT_PLAIN}\n\n${READ_CONNECT}`,
      },
      { heading: 'Course structure (read once)', body: HOW_COURSE_WORKS },
      {
        heading: 'While you read',
        body:
          '- Write one plain-language note you could tell a store manager.\n' +
          '- Mark one risk (security, wrong answer, cost, or delay).\n' +
          '- Note which **Todo lab** or **Ask IT assignment** comes next in this stage.',
      }
    )
  } else if (item.type === 'lab') {
    sections.push(
      {
        heading: 'Overview',
        body: `${summary}\n\n${TODO_PLAIN}`,
      },
      {
        heading: 'What to do (with your tutor)',
        body:
          '1. Open the **Todo · Tutored lab** panel below.\n' +
          '2. Copy **one** prompt at a time into your AI tool (Cursor, ChatGPT, etc.).\n' +
          '3. Run the checkpoint (command, file, or screenshot). **Do not skip ahead.**\n' +
          '4. If you see an error, expand **Troubleshooting** and paste the fix prompt.\n' +
          '5. When the lab is done, open the **Ask IT assignment** in this stage and repeat the idea without your tutor.',
      }
    )
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
    typeExtras.objectives = [
      `Understand "${item.title}" in the Ask IT customer context`,
      'Connect the idea to the Todo lab and Ask IT assignment in this stage',
      'Explain one takeaway to a non-technical teammate',
    ]
    typeExtras.checkpointQuestions = [
      'Can you explain this in two minutes without jargon?',
      'Which Todo lab skill does this feed?',
    ]
  } else if (item.type === 'lab') {
    typeExtras.deliverables = ['Files or logs named in the lab panel', 'Notes on what transfers to Ask IT']
  } else if (item.type === 'assignment') {
    typeExtras.deliverables = ['Ask IT artifacts named in the assignment panel', 'Evidence you ran checks locally']
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
function withNarrativePreamble(item: RoadmapItem, sections: ItemSection[]): ItemSection[] {
  if (!sections.length || sectionMentionsPath(sections)) return sections
  if (item.type === 'read') {
    return [
      {
        heading: READ_FIT_HEADING,
        body: `${READ_CONNECT}\n\n${ASK_IT_PLAIN}`,
      },
      ...sections,
    ]
  }
  if (item.type === 'lab') {
    return [
      {
        heading: LAB_FIT_HEADING,
        body: `${TODO_PLAIN}\n\nOpen the **Todo · Tutored lab** panel below. One prompt at a time; pass each checkpoint before the next.`,
      },
      ...sections,
    ]
  }
  if (item.type === 'assignment') {
    return [
      {
        heading: ASSIGNMENT_FIT_HEADING,
        body: `${ASK_IT_PLAIN}\n\n**Solo work**—use **Skills from the lab** in the panel, then the same prompt → checkpoint → fix loop on **Ask IT**.`,
      },
      ...sections,
    ]
  }
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
      sections: withNarrativePreamble(resolved.item, sections),
      typeExtras: fromJson.typeExtras || defaults.typeExtras,
    }
  }
  return defaults
}

export function itemContentKey(stageSlug: string, itemSlug: string): string {
  return `${stageSlug}/${itemSlug}`
}
