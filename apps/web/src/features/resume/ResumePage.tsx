import { useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Card } from 'animal-island-ui'
import { useResume } from './useResume'
import { BasicsSection } from './sections/BasicsSection'
import { WorkSection } from './sections/WorkSection'
import { EducationSection } from './sections/EducationSection'
import { SkillsSection } from './sections/SkillsSection'
import { ProjectsSection } from './sections/ProjectsSection'

export function ResumePage() {
  const { data: resume, isLoading, isError, error } = useResume()
  const navigate = useNavigate()

  const close = () => navigate({ to: '/' })

  // ESC to close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  if (isLoading) return <div className="p-8">Loading...</div>
  if (isError) return <div className="p-8 text-red-700">Error: {String(error)}</div>
  if (!resume) return null

  return (
    // Full-screen dimmed backdrop, click outside to close
    <div
      onClick={close}
      className="fixed inset-0 bg-black/40 flex items-start justify-center p-8 overflow-y-auto"
    >
      {/* Card wrapper — stop click from bubbling so clicking inside doesn't close */}
      <div onClick={(e) => e.stopPropagation()} className="relative w-full max-w-2xl">
        <button
          onClick={close}
          aria-label="Close resume"
          title="關閉 (ESC)"
          className="absolute -top-3 -right-3 z-10 w-9 h-9 rounded-full bg-white shadow-md text-gray-700 hover:text-red-600 text-xl leading-none"
        >
          ×
        </button>
        <Card color="default">
          <div className="space-y-6">
            <BasicsSection basics={resume.basics} />
            {resume.work.length > 0 && (
              <>
                <hr className="border-gray-200" />
                <WorkSection work={resume.work} />
              </>
            )}
            {resume.education.length > 0 && (
              <>
                <hr className="border-gray-200" />
                <EducationSection education={resume.education} />
              </>
            )}
            {resume.skills.length > 0 && (
              <>
                <hr className="border-gray-200" />
                <SkillsSection skills={resume.skills} />
              </>
            )}
            {resume.projects.length > 0 && (
              <>
                <hr className="border-gray-200" />
                <ProjectsSection projects={resume.projects} />
              </>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
