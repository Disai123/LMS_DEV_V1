import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link, useLocation } from 'react-router-dom'
import FaqAccordion from '../components/FaqAccordion'
import ProgressBar from '../components/ProgressBar'
import StageSection from '../components/StageSection'
import VisualRoadmap from '../components/VisualRoadmap'
import { useFdeProgress } from '../context/FdeProgressContext'
import { getRoadmapData } from '../lib/stages.ts'

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

  return (
    <>
      <Helmet>
        <title>Forward Deployed Engineer Roadmap · GNANAM AI</title>
        <meta
          name="description"
          content="12-week FDE roadmap: software engineering, AI, discovery, architecture, development, MVP testing, production, enterprise AI, and Unified Commerce AI capstone."
        />
      </Helmet>

      <header className="pt-2">
        <p className="fde-eyebrow m-0">{data.hero.eyebrow}</p>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight mt-3 mb-3">{data.hero.title}</h1>
        <p className="text-base sm:text-lg leading-relaxed text-[var(--fde-mut)] max-w-2xl m-0">
          {data.hero.subtitle}
        </p>

        <div className="flex flex-wrap gap-2 mt-5">
          {data.chips.map((c) => (
            <span
              key={c}
              className="text-xs font-medium border border-[var(--fde-bd)] rounded-full px-3 py-1 text-[var(--fde-mut)] bg-[var(--fde-card)]"
            >
              {c}
            </span>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-[6fr_4fr_2fr] gap-2 mt-6">
        {data.phases.map((ph) => (
          <div
            key={ph.label}
            className="rounded-lg border border-[var(--fde-bd)] bg-[var(--fde-card)] px-4 py-3 text-xs leading-relaxed text-[var(--fde-mut)]"
          >
            <b className="block text-sm font-semibold text-[var(--fde-tx)] mb-0.5">{ph.label}</b>
            {ph.detail}
          </div>
        ))}
      </div>

      <h2 className="fde-eyebrow mt-10 mb-2">Visual roadmap</h2>
      <VisualRoadmap stages={data.stages} />

      <div className="rounded-xl border border-[var(--fde-bd)] bg-[var(--fde-card)] px-5 py-4 mt-2 mb-10">
        <p className="text-sm m-0 mb-2.5 tabular-nums">
          <span className="font-semibold">
            {doneCount}/{totalItems} items done
          </span>
          <span className="text-[var(--fde-mut)]"> · {percent}%</span>
        </p>
        <ProgressBar percent={percent} />
      </div>

      <h2 className="text-2xl font-bold tracking-tight mb-5">Stage by stage</h2>
      {data.stages.map((stage, index) => (
        <StageSection key={stage.slug} stage={stage} index={index} />
      ))}

      <section
        className="border border-[var(--fde-bd)] border-l-4 rounded-xl px-5 py-6 sm:px-7 bg-[var(--fde-card)] mb-12 mt-8"
        style={{ borderLeftColor: '#27d3e0' }}
      >
        <h2 className="text-lg font-bold tracking-tight mb-2">Capstone</h2>
        <p className="text-[0.9375rem] leading-relaxed text-[var(--fde-mut)] mb-4 max-w-3xl">{data.capstone.intro}</p>
        <Link
          to="/roadmap/fde/capstone"
          className="inline-block text-sm font-medium border border-[var(--fde-bd)] rounded-lg px-4 py-2 hover:border-[#27d3e0]"
        >
          View capstone brief →
        </Link>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-bold tracking-tight mb-4">What you&apos;ll be able to do</h2>
        <ul className="fde-bullets text-[0.9375rem] max-w-3xl">
          {data.capabilities.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-bold tracking-tight mb-4">FAQ</h2>
        <FaqAccordion items={data.faq} />
      </section>
    </>
  )
}
