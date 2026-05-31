import { Card } from 'animal-island-ui'
import type { Project } from '@amowu/shared'

export function ProjectsSection({ projects }: { projects: Project[] }) {
  return (
    <Card color="app-yellow">
      <h2 className="text-xl font-bold mb-3">Projects</h2>
      <ul className="space-y-3">
        {projects.map((p, i) => (
          <li key={i} className="border-l-2 border-amber-400 pl-3">
            <div className="font-semibold">
              {p.url ? <a href={p.url}>{p.name}</a> : p.name}
            </div>
            {p.description && <p className="text-sm">{p.description}</p>}
            {p.keywords.length > 0 && (
              <div className="mt-1 flex flex-wrap gap-1">
                {p.keywords.map((k) => (
                  <span key={k} className="px-1.5 py-0.5 bg-amber-100 rounded text-xs">{k}</span>
                ))}
              </div>
            )}
            {p.highlights.length > 0 && (
              <ul className="list-disc list-inside text-sm mt-1">
                {p.highlights.map((h, j) => <li key={j}>{h}</li>)}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </Card>
  )
}
