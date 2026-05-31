import { createRootRoute, Outlet } from '@tanstack/react-router'
import { PhaserGame } from '../PhaserGame'
import { DialogueOverlay } from '../features/dialogue/DialogueOverlay'

export const Route = createRootRoute({
  component: () => (
    <>
      <PhaserGame />
      <main className="absolute inset-0 pointer-events-none">
        <div className="pointer-events-auto">
          <Outlet />
        </div>
      </main>
      <DialogueOverlay />
    </>
  ),
})
