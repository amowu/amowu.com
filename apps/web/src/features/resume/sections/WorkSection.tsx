import type { Work } from '@amowu/shared'

export function WorkSection({ work }: { work: Work[] }) {
  return (
    <section>
      <h2 className="text-xl font-bold mb-3">Work</h2>
      <ul className="space-y-4">
        {work.map((w, i) => (
          <li key={i} className="border-l-2 border-gray-300 pl-3">
            <div className="font-semibold">{w.position} @ {w.name}</div>
            <div className="text-xs text-gray-600">
              {w.startDate}{w.endDate ? ` – ${w.endDate}` : ' – present'}
              {w.location && <> · {w.location}</>}
            </div>
            {w.summary && <p className="text-sm mt-1">{w.summary}</p>}
            {w.highlights.length > 0 && (
              <ul className="list-disc list-inside text-sm mt-1">
                {w.highlights.map((h, j) => <li key={j}>{h}</li>)}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
