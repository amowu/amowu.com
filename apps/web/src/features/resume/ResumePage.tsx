import { useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
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
    <div className="m-8 max-w-2xl space-y-4 overflow-y-auto max-h-screen relative">
      <button
        onClick={close}
        aria-label="Close resume"
        title="關閉 (ESC)"
        className="sticky top-0 ml-auto block w-9 h-9 rounded-full bg-white/90 shadow text-gray-700 hover:bg-white hover:text-red-600 text-xl leading-none z-10"
      >
        ×
      </button>
      <BasicsSection basics={resume.basics} />
      {resume.work.length > 0 && <WorkSection work={resume.work} />}
      {resume.education.length > 0 && <EducationSection education={resume.education} />}
      {resume.skills.length > 0 && <SkillsSection skills={resume.skills} />}
      {resume.projects.length > 0 && <ProjectsSection projects={resume.projects} />}
    </div>
  )
}
