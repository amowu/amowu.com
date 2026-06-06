import { useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { EventBus } from '../../game/EventBus'
import { dialogues, type DialogueId } from './dialogues'
import { useDialogueMachine } from './useDialogueMachine'
import { DialogueBox } from './DialogueBox'
import { DialogueOptions } from './DialogueOptions'
import type { DialogueNext } from './types'

export function DialogueOverlay() {
  const { state, open, typeEnd, advance, close } = useDialogueMachine()
  const navigate = useNavigate()

  // Subscribe to Phaser EventBus for dialogue:open
  useEffect(() => {
    const handler = (id: DialogueId) => open(id)
    EventBus.on('dialogue:open', handler)
    return () => {
      EventBus.off('dialogue:open', handler)
    }
  }, [open])

  // Pause/resume game on open/close
  useEffect(() => {
    if (state.status === 'idle') {
      EventBus.emit('game:resume')
    } else {
      EventBus.emit('game:pause')
    }
  }, [state.status])

  function handleNext(next: DialogueNext) {
    switch (next.kind) {
      case 'dialogue':
        advance(next.id as DialogueId)
        break
      case 'route':
        navigate({ to: next.to })
        close()
        break
      case 'url':
        window.open(next.href, '_blank', 'noopener,noreferrer')
        close()
        break
      case 'close':
        close()
        break
      case 'options':
        // Should not reach here — options handled via DialogueOptions
        break
    }
  }

  if (state.status === 'idle') return null

  const node = dialogues[state.activeId]

  return (
    <DialogueBox
      open
      text={node.text}
      onTypeEnd={typeEnd}
      onClose={close}
    >
      {state.status === 'waitingOption' && node.next.kind === 'options' && (
        <DialogueOptions items={node.next.items} onSelect={handleNext} />
      )}
      {state.status === 'waitingNext' && (
        <button
          onClick={() => handleNext(node.next)}
          className="mt-4 text-right text-sm text-gray-500 w-full hover:underline cursor-pointer"
        >
          點擊以繼續…
        </button>
      )}
    </DialogueBox>
  )
}
