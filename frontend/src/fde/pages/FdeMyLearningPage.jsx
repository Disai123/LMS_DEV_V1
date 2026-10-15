import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import ProgressBar from '../components/ProgressBar'
import { useFdeProgress } from '../context/FdeProgressContext'
import { getAllItems } from '../lib/stages.ts'

export default function FdeMyLearningPage() {
  const { percent, stageStats, isDone } = useFdeProgress()

  return (
    <>
      <Helmet>
        <title>My Learning · FDE Roadmap · GNANAM AI</title>
        <meta name="description" content="Your FDE roadmap progress saved in this browser." />
      </Helmet>

      <Link to="/roadmap/fde" className="text-sm text-[var(--fde-mut)] inline-block mb-4">
        ← Back to roadmap
      </Link>
      <h1 className="text-3xl font-bold mb-2">My Learning</h1>
      <p className="text-lg mb-2">{percent}% complete</p>
      <ProgressBar percent={percent} className="mb-8 max-w-md" />

      <div className="space-y-3">
        {stageStats.map(({ stage, done, total, readsDone, readsTotal, practiseDone, practiseTotal }, index) => (
          <div
            key={stage.slug}
            className="border border-[var(--fde-bd)] border-l-4 rounded-xl p-4 bg-[var(--fde-card)]"
            style={{ borderLeftColor: stage.color }}
          >
            <Link
              to={`/roadmap/fde#stage-${stage.slug}`}
              className="font-semibold hover:underline"
              style={{ color: stage.color }}
            >
              {index + 1}. {stage.name}
            </Link>
            <p className="text-sm text-[var(--fde-mut)] mt-1">
              {done}/{total} done · {stage.weeksLabel}
              {readsTotal > 0 && ` · Read ${readsDone}/${readsTotal}`}
              {practiseTotal > 0 && ` · Practise ${practiseDone}/${practiseTotal}`}
            </p>
            {total > 0 && <ProgressBar percent={(done / total) * 100} className="mt-2 max-w-xs" />}
            {done < total && (
              <ul className="mt-3 space-y-1 text-sm">
                {getAllItems(stage)
                  .filter((it) => !isDone(stage.slug, it.slug))
                  .slice(0, 3)
                  .map((it) => (
                    <li key={it.slug}>
                      <Link
                        to={`/roadmap/fde/item/${stage.slug}/${it.slug}`}
                        className="text-[var(--fde-mut)] hover:text-[var(--fde-tx)]"
                      >
                        Continue: {it.title}
                      </Link>
                    </li>
                  ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </>
  )
}
