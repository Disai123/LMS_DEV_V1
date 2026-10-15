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
          content="12-week FDE roadmap: software engineering, AI, discovery, architecture, POC, MVP, production, enterprise AI, and capstone."
        />
      </Helmet>

      <p className="text-[var(--fde-mut)] text-sm">{data.hero.eyebrow}</p>
      <h1 className="text-3xl sm:text-4xl font-bold mt-2 mb-2">{data.hero.title}</h1>
      <p className="text-[var(--fde-mut)] max-w-2xl">{data.hero.subtitle}</p>

      <div className="flex flex-wrap gap-2 mt-4">
        {data.chips.map((c) => (
          <span
            key={c}
            className="text-xs border border-[var(--fde-bd)] rounded-full px-3 py-0.5 text-[var(--fde-mut)]"
          >
            {c}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[6fr_4fr_2fr] gap-1.5 mt-5">
        {data.phases.map((ph) => (
          <div
            key={ph.label}
            className="rounded-lg border border-[var(--fde-bd)] bg-[var(--fde-card)] px-3 py-2 text-xs"
          >
            <b className="block text-sm mb-0.5">{ph.label}</b>
            {ph.detail}
          </div>
        ))}
      </div>

      <h2 className="text-sm font-semibold mt-8 mb-1 text-[var(--fde-mut)]">Visual roadmap</h2>
      <VisualRoadmap stages={data.stages} />

      <p className="text-sm">
        {doneCount}/{totalItems} items done · {percent}%
      </p>
      <ProgressBar percent={percent} className="mb-8" />

      <h2 className="text-2xl font-bold mb-4">Stage by stage</h2>
      {data.stages.map((stage, index) => (
        <StageSection key={stage.slug} stage={stage} index={index} />
      ))}

      <div className="border border-[var(--fde-bd)] rounded-xl p-5 bg-[var(--fde-card)] mb-8 mt-4">
        <h2 className="text-lg font-bold mb-2">Capstone</h2>
        <p className="text-sm text-[var(--fde-mut)] mb-3">{data.capstone.intro}</p>
        <Link
          to="/roadmap/fde/capstone"
          className="inline-block text-sm border border-[var(--fde-bd)] rounded-lg px-4 py-2 hover:border-[#27d3e0]"
        >
          View capstone brief →
        </Link>
      </div>

      <h2 className="text-xl font-bold mb-3">What you&apos;ll be able to do</h2>
      <ul className="list-none space-y-2 mb-10">
        {data.capabilities.map((c) => (
          <li key={c} className="text-sm pl-0">
            • {c}
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-bold mb-3">FAQ</h2>
      <FaqAccordion items={data.faq} />
    </>
  )
}
