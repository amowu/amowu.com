import type { Skill } from '@amowu/shared'

export function SkillsSection({ skills }: { skills: Skill[] }) {
  return (
    <section>
      <h2 className="text-xl font-bold mb-3">Skills</h2>
      <ul className="space-y-2">
        {skills.map((s, i) => (
          <li key={i}>
            <div className="font-semibold">
              {s.name}
              {s.level && <span className="ml-2 text-xs text-gray-600">({s.level})</span>}
            </div>
            {s.keywords.length > 0 && (
              <div className="mt-1 flex flex-wrap gap-1">
                {s.keywords.map((k) => (
                  <span key={k} className="px-2 py-0.5 bg-gray-100 rounded text-xs">{k}</span>
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
