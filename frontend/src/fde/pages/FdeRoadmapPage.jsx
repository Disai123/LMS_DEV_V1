import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link, useLocation } from 'react-router-dom'
import {
  ArrowRight,
  BookOpen,
  Brain,
  ClipboardList,
  Clock,
  CloudUpload,
  Code2,
  FlaskConical,
  Layers,
  LayoutGrid,
  ShieldCheck,
  Trophy,
  UserCheck,
  Users,
  Wrench,
} from 'lucide-react'
import FaqAccordion from '../components/FaqAccordion'
import { FdeHeroHeadline, FdeSectionHeader } from '../components/FdeEditorialHeading'
import ProgressBar from '../components/ProgressBar'
import StageSection from '../components/StageSection'
import VisualRoadmap from '../components/VisualRoadmap'
import { useFdeProgress } from '../context/FdeProgressContext'
import { getRoadmapData } from '../lib/stages.ts'

const CAPABILITY_STYLES = [
  { icon: Code2, color: '#2fd3a0', tag: 'Python & APIs' },
  { icon: Brain, color: '#3aa6ff', tag: 'LLMs & agents' },
  { icon: ClipboardList, color: '#a074ff', tag: 'Discovery & BRD' },
  { icon: Layers, color: '#ffd23a', tag: 'UX & architecture' },
  { icon: Wrench, color: '#27c4c4', tag: 'Build & test' },
  { icon: CloudUpload, color: '#7a8cff', tag: 'Deploy & observe' },
  { icon: ShieldCheck, color: '#ff5fa8', tag: 'Security & handover' },
  { icon: Trophy, color: '#27d3e0', tag: 'Capstone' },
]

const SECTION_STYLES = {
  'Section 1': { color: '#35d49a', title: 'Foundations', icon: Code2 },
  'Section 2': { color: '#a074ff', title: 'FDE SDLC delivery', icon: Users },
  'Section 3': { color: '#27d3e0', title: 'Capstone', icon: Trophy },
}

const LEARNING_MODES = [
  {
    icon: BookOpen,
    color: '#3aa6ff',
    title: 'Read',
    body: 'Concise concept modules for every stage — the vocabulary and patterns an FDE uses with customers.',
  },
  {
    icon: FlaskConical,
    color: '#35d49a',
    title: 'Lab · with tutor',
    body: 'Guided Todo app labs with copy-ready AI prompts, checkpoints, and troubleshooting fixes.',
  },
  {
    icon: UserCheck,
    color: '#f0b429',
    title: 'Assignment · solo',
    body: 'Apply the same skills independently on the Customer support ticketing system engagement.',
  },
  {
    icon: Trophy,
    color: '#27d3e0',
    title: 'Capstone',
    body: 'One integrated e-commerce Fullstack Agentic RAG application across four modules.',
  },
]

export default function FdeRoadmapPage() {
  const data = getRoadmapData()
  const { doneCount, totalItems, percent } = useFdeProgress()
  const location = useLocation()

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '')
      requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    }
  }, [location.hash])

  const allItems = data.stages.flatMap((s) => [...s.reads, ...s.practise])
  const totalHours = data.stages.reduce((sum, s) => sum + s.hours, 0)
  const stats = [
    { label: 'Hours', value: totalHours, accent: true },
    { label: 'Stages', value: data.stages.length, accent: false },
    { label: 'Labs', value: allItems.filter((i) => i.type === 'lab').length, accent: false },
    { label: 'Assignments', value: allItems.filter((i) => i.type === 'assignment').length, accent: false },
  ]

  const firstStage = data.stages[0]
  const startHref = `/roadmap/fde/item/${firstStage.slug}/${firstStage.reads[0]?.slug}`

  const sections = data.phases.map((ph) => {
    const key = ph.label.split('·')[0].trim()
    return {
      ...ph,
      key,
      style: SECTION_STYLES[key] || SECTION_STYLES['Section 1'],
      stages: data.stages
        .map((s, i) => ({ ...s, index: i }))
        .filter((s) => s.sectionLabel === key),
    }
  })

  return (
    <div className="space-y-16 w-full">
      <Helmet>
        <title>Forward Deployed Engineer Roadmap · GNANAM AI</title>
        <meta
          name="description"
          content="40-hour FDE roadmap: software engineering, AI engineering, BRD, UI/UX, architecture, backend and frontend development, deployment, Langfuse/evals/guardrails, and one e-commerce Fullstack Agentic RAG capstone."
        />
      </Helmet>

      <section className="fde-hero -mx-4 sm:-mx-6 lg:-mx-10 xl:-mx-14 2xl:-mx-16 rounded-none border-x-0 border-t-0 border-b border-[var(--fde-bd)] px-8 py-14 sm:px-14 lg:px-20 sm:py-20">
        <div className="relative z-[1] grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-12 items-end">
          <div>
            <FdeHeroHeadline eyebrow={data.hero.eyebrow} subtitle={data.hero.subtitle} />
            <div className="flex flex-wrap gap-4 mt-10">
              <Link
                to={startHref}
                className="group inline-flex items-center gap-3 bg-amber-400 text-slate-900 font-bold text-base px-7 py-4 rounded-xl hover:bg-amber-300 transition-all duration-300 shadow-lg shadow-amber-400/20"
              >
                Start learning
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden />
              </Link>
              <Link
                to="/roadmap/fde/capstone"
                className="inline-flex items-center gap-3 border border-white/15 text-[var(--fde-tx)] font-semibold text-base px-7 py-4 rounded-xl hover:border-amber-400/40 hover:bg-white/[0.04] transition-all duration-300"
              >
                <Trophy className="w-4 h-4 text-amber-400" aria-hidden />
                View capstone
              </Link>
            </div>
          </div>
          <dl className="grid grid-cols-2 gap-3 mb-0 m-0">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-white/10 bg-black/20 backdrop-blur-sm px-4 py-4"
              >
                <dd
                  className={`text-3xl sm:text-4xl font-black font-display tabular-nums m-0 ${
                    s.accent ? 'text-amber-400' : 'text-[var(--fde-tx)]'
                  }`}
                >
                  {s.value}
                </dd>
                <dt className="text-[11px] uppercase tracking-[0.2em] text-[var(--fde-mut)] mt-1 font-semibold">
                  {s.label}
                </dt>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section>
        <FdeSectionHeader
          sectionIndex={1}
          label="Outcomes"
          title="What you will"
          emphasis="achieve"
          description="Eight job-ready capabilities you build stage by stage — from your first API to a production handover."
        />
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 list-none p-0 m-0">
          {data.capabilities.map((c, i) => {
            const { icon: Icon, color, tag } = CAPABILITY_STYLES[i % CAPABILITY_STYLES.length]
            return (
              <li
                key={c}
                className="fde-glow-card relative rounded-xl border border-[var(--fde-bd)] bg-[var(--fde-card)] p-5 overflow-hidden"
                style={{ '--fde-accent': color }}
              >
                <span className="absolute inset-x-0 top-0 h-0.5" style={{ background: color }} aria-hidden />
                <span
                  className="inline-flex w-10 h-10 items-center justify-center rounded-lg mb-4"
                  style={{ background: `${color}1f`, color }}
                >
                  <Icon className="w-5 h-5" aria-hidden />
                </span>
                <p className="text-[11px] font-semibold uppercase tracking-wider m-0 mb-1.5" style={{ color }}>
                  {tag}
                </p>
                <p className="text-sm leading-relaxed text-[var(--fde-tx)] m-0">{c}</p>
              </li>
            )
          })}
        </ul>
      </section>

      <section>
        <FdeSectionHeader
          sectionIndex={2}
          label="The journey"
          title="Three sections,"
          emphasis="one path"
          description="40 hours · 2 foundation stages · 7 customer-delivery stages · 1 capstone stage"
        />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
          {sections.map(({ key, label, detail, style, stages }) => {
            const Icon = style.icon
            const hours = label.split('·')[1]?.trim() || ''
            return (
              <div
                key={label}
                className="fde-glow-card h-full min-h-[18rem] lg:h-[22rem] rounded-xl border border-[var(--fde-bd)] p-6 flex flex-col"
                style={{
                  '--fde-accent': style.color,
                  background: `linear-gradient(160deg, ${style.color}1a 0%, var(--fde-card) 45%)`,
                }}
              >
                <div className="flex items-center justify-between gap-3 mb-4">
                  <span
                    className="inline-flex w-11 h-11 items-center justify-center rounded-xl shrink-0"
                    style={{ background: `${style.color}26`, color: style.color }}
                  >
                    <Icon className="w-5 h-5" aria-hidden />
                  </span>
                  <span
                    className="inline-flex items-center gap-1 text-xs font-semibold rounded-full px-2.5 py-1 shrink-0"
                    style={{ background: `${style.color}1f`, color: style.color }}
                  >
                    <Clock className="w-3.5 h-3.5" aria-hidden />
                    {hours}
                  </span>
                </div>
                <p className="text-xs font-semibold uppercase tracking-wider m-0" style={{ color: style.color }}>
                  {key}
                </p>
                <h3 className="font-display text-xl font-black m-0 mt-1 mb-2">{style.title}</h3>
                <p className="text-sm leading-relaxed text-[var(--fde-mut)] m-0">{detail}</p>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--fde-mut)] mt-4 mb-2">
                  {stages.length} stage{stages.length === 1 ? '' : 's'}
                </p>
                <ul className="list-none p-0 m-0 flex flex-col gap-1.5 flex-1 min-h-0 overflow-y-auto content-start pr-1 fde-scrollbar">
                  {stages.map((s) => (
                    <li key={s.slug}>
                      <a
                        href={`#stage-${s.slug}`}
                        className="flex items-center gap-2 text-xs font-medium rounded-lg border px-2.5 py-2 bg-[var(--fde-bg)] hover:text-[var(--fde-tx)] transition-colors"
                        style={{ borderColor: `${s.color}44`, color: s.color }}
                      >
                        <span
                          className="shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold tabular-nums"
                          style={{ background: `${s.color}22`, color: s.color }}
                        >
                          {s.index + 1}
                        </span>
                        <span className="leading-snug text-[var(--fde-tx)]">{s.name}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </section>

      <section>
        <FdeSectionHeader
          sectionIndex={3}
          label="How you learn"
          title="Four ways every"
          emphasis="stage is delivered"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {LEARNING_MODES.map(({ icon: Icon, color, title, body }) => (
            <div
              key={title}
              className="fde-glow-card rounded-xl border border-[var(--fde-bd)] bg-[var(--fde-card)] p-5 border-l-4"
              style={{ '--fde-accent': color, borderLeftColor: color }}
            >
              <Icon className="w-5 h-5 mb-3" style={{ color }} aria-hidden />
              <h3 className="font-display text-lg font-black m-0 mb-1.5 text-[var(--fde-tx)]">{title}</h3>
              <p className="text-sm leading-relaxed text-[var(--fde-mut)] m-0">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <FdeSectionHeader
          sectionIndex={4}
          label="Visual roadmap"
          title="All stages"
          emphasis="at a glance"
          description={`${data.stages.length} stages — click a card to jump to reads, labs, and assignments.`}
        />
        <div className="rounded-xl border border-[var(--fde-bd)] bg-[var(--fde-card)] px-4 pt-4 pb-5 sm:px-6">
          <VisualRoadmap stages={data.stages} />
          <div className="border-t border-[var(--fde-bd)] mt-3 pt-4 flex flex-wrap items-center gap-x-6 gap-y-3">
            <p className="text-sm m-0 tabular-nums flex items-center gap-2">
              <LayoutGrid className="w-4 h-4 text-[#35d49a]" aria-hidden />
              <span className="font-semibold">
                {doneCount}/{totalItems} items done
              </span>
              <span className="text-[#35d49a] font-semibold">{percent}%</span>
            </p>
            <ProgressBar percent={percent} className="flex-1 min-w-[180px]" />
          </div>
        </div>
      </section>

      <section>
        <FdeSectionHeader sectionIndex={5} label="Curriculum" title="Stage by" emphasis="stage" />
        <div className="space-y-5">
          {data.stages.map((stage, index) => (
            <StageSection key={stage.slug} stage={stage} index={index} />
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-[var(--fde-card)] px-6 py-10 sm:px-10">
        <span
          className="absolute right-4 top-2 text-[5rem] font-black font-display text-[var(--fde-tx)] opacity-[0.04] leading-none select-none pointer-events-none"
          aria-hidden
        >
          06
        </span>
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8 items-center relative z-[1]">
          <div>
            <FdeSectionHeader
              label="Capstone"
              title="E-commerce Fullstack"
              emphasis="Agentic RAG"
              description={data.capstone.intro}
              className="!mb-6"
            />
            <Link
              to="/roadmap/fde/capstone"
              className="group inline-flex items-center gap-3 bg-amber-400 text-slate-900 font-bold text-base px-7 py-4 rounded-xl hover:bg-amber-300 transition-all shadow-lg shadow-amber-400/20"
            >
              View capstone brief
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden />
            </Link>
          </div>
          <ol className="list-none p-0 m-0 space-y-2.5">
            {data.capstone.deliverables.map((d, i) => {
              const [head, ...rest] = d.split('—')
              return (
                <li
                  key={d}
                  className="flex gap-3 items-start rounded-lg border border-[var(--fde-bd)] bg-[var(--fde-bg)]/70 px-4 py-3"
                >
                  <span className="shrink-0 w-7 h-7 rounded-full bg-[#27d3e0]/15 text-[#27d3e0] text-xs font-bold flex items-center justify-center tabular-nums">
                    {i + 1}
                  </span>
                  <span className="text-sm leading-snug">
                    <span className="font-semibold text-[var(--fde-tx)]">{head.replace(/^Module \d+:\s*/, '').trim()}</span>
                    {rest.length > 0 && (
                      <span className="block text-xs text-[var(--fde-mut)] mt-0.5">{rest.join('—').trim()}</span>
                    )}
                  </span>
                </li>
              )
            })}
          </ol>
        </div>
      </section>

      <section className="pb-4">
        <FdeSectionHeader sectionIndex={7} label="FAQ" title="Questions," emphasis="answered" />
        <FaqAccordion items={data.faq} />
      </section>
    </div>
  )
}
