import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { getRoadmapData } from '../lib/stages.ts'

export default function FdeCapstonePage() {
  const { capstone } = getRoadmapData()
  const startUrl = `/roadmap/fde/item/${capstone.startStageSlug}/${capstone.startItemSlug}`

  return (
    <>
      <Helmet>
        <title>Capstone brief · FDE Roadmap · GNANAM AI</title>
        <meta name="description" content={capstone.intro} />
      </Helmet>

      <Link to="/roadmap/fde" className="text-sm text-[var(--fde-mut)] hover:text-[var(--fde-tx)] inline-block mb-6">
        ← Back to roadmap
      </Link>
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight mb-4">{capstone.title}</h1>
      <p className="text-base sm:text-lg leading-relaxed text-[var(--fde-mut)] mb-8 max-w-3xl">{capstone.intro}</p>

      <section
        className="border border-[var(--fde-bd)] border-l-4 rounded-xl px-5 py-6 sm:px-7 bg-[var(--fde-card)] mb-10"
        style={{ borderLeftColor: '#27d3e0' }}
      >
        <h2 className="text-lg font-semibold tracking-tight mb-4">Deliverables</h2>
        <ol className="list-decimal pl-5 space-y-2.5 text-[0.9375rem] leading-relaxed marker:font-semibold marker:text-[#27d3e0]">
          {capstone.deliverables.map((d) => (
            <li key={d} className="pl-1">
              {d}
            </li>
          ))}
        </ol>
      </section>

      <h2 className="text-xl font-bold tracking-tight mb-4">Quality expectations</h2>
      <div className="grid gap-3 sm:grid-cols-2 mb-10">
        {capstone.strongWork.map((block) => (
          <div key={block.title} className="border border-[var(--fde-bd)] rounded-lg px-5 py-4 bg-[var(--fde-card)]">
            <h3 className="text-[0.9375rem] font-semibold mb-1.5">{block.title}</h3>
            <p className="text-sm leading-relaxed text-[var(--fde-mut)] m-0">{block.body}</p>
          </div>
        ))}
      </div>

      <Link
        to={startUrl}
        className="inline-block text-sm border border-[var(--fde-bd)] rounded-lg px-5 py-2.5 bg-[var(--fde-card)] hover:border-[#27d3e0] font-medium"
      >
        Open capstone brief
      </Link>
    </>
  )
}
