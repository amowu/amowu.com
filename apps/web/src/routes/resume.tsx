import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/resume')({
  component: () => (
    <div className="p-8 bg-white/80 m-8 rounded-2xl">
      <h1 className="text-2xl">Resume (placeholder)</h1>
    </div>
  ),
})
