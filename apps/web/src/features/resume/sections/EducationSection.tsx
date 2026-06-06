import type { Education } from '@amowu/shared'

export function EducationSection({ education }: { education: Education[] }) {
  return (
    <section>
      <h2 className="text-xl font-bold mb-3">Education</h2>
      <ul className="space-y-3">
        {education.map((e, i) => (
          <li key={i} className="border-l-2 border-gray-300 pl-3">
            <div className="font-semibold">
              {e.studyType ? `${e.studyType} of ` : ''}{e.area}
            </div>
            <div className="text-sm">{e.institution}</div>
            <div className="text-xs text-gray-600">
              {e.startDate}{e.endDate ? ` – ${e.endDate}` : ''}
              {e.score && <> · GPA {e.score}</>}
            </div>
            {e.courses.length > 0 && (
              <div className="text-sm mt-1">Courses: {e.courses.join(', ')}</div>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
