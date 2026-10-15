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

      <Link to="/roadmap/fde" className="text-sm text-[var(--fde-mut)] inline-block mb-4">
        ← Back to roadmap
      </Link>
      <h1 className="text-3xl font-bold mb-3">{capstone.title}</h1>
      <p className="text-[var(--fde-mut)] mb-6 max-w-2xl">{capstone.intro}</p>

      <div
        className="border border-[var(--fde-bd)] border-l-4 rounded-xl p-5 bg-[var(--fde-card)] mb-8"
        style={{ borderLeftColor: '#27d3e0' }}
      >
        <h2 className="text-lg font-semibold mb-3">What to deliver</h2>
        <ol className="list-decimal pl-5 space-y-2 text-sm">
          {capstone.deliverables.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ol>
      </div>

      <h2 className="text-xl font-bold mb-4">What strong work looks like</h2>
      <div className="space-y-4 mb-8">
        {capstone.strongWork.map((block) => (
          <div key={block.title} className="border border-[var(--fde-bd)] rounded-lg p-4 bg-[var(--fde-card)]">
            <h3 className="font-semibold mb-1">{block.title}</h3>
            <p className="text-sm text-[var(--fde-mut)] m-0">{block.body}</p>
          </div>
        ))}
      </div>

      <Link
        to={startUrl}
        className="inline-block text-sm border border-[var(--fde-bd)] rounded-lg px-5 py-2.5 bg-[var(--fde-card)] hover:border-[#27d3e0] font-medium"
      >
        Start the capstone project
      </Link>
    </>
  )
}
