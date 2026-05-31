import { useReducer, useCallback } from 'react'
import { dialogues, type DialogueId } from './dialogues'

type State =
  | { status: 'idle'; activeId?: undefined }
  | { status: 'typing'; activeId: DialogueId }
  | { status: 'waitingOption'; activeId: DialogueId }
  | { status: 'waitingNext'; activeId: DialogueId }

type Action =
  | { type: 'open'; id: DialogueId }
  | { type: 'typeEnd' }
  | { type: 'advance'; nextId: DialogueId }
  | { type: 'close' }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'open':
      return { status: 'typing', activeId: action.id }
    case 'typeEnd': {
      if (state.status !== 'typing') return state
      const node = dialogues[state.activeId]
      const isOptions = node.next.kind === 'options'
      return {
        status: isOptions ? 'waitingOption' : 'waitingNext',
        activeId: state.activeId,
      }
    }
    case 'advance':
      return { status: 'typing', activeId: action.nextId }
    case 'close':
      return { status: 'idle' }
  }
}

export function useDialogueMachine() {
  const [state, dispatch] = useReducer(reducer, { status: 'idle' } as State)
  const open = useCallback((id: DialogueId) => dispatch({ type: 'open', id }), [])
  const typeEnd = useCallback(() => dispatch({ type: 'typeEnd' }), [])
  const advance = useCallback((nextId: DialogueId) => dispatch({ type: 'advance', nextId }), [])
  const close = useCallback(() => dispatch({ type: 'close' }), [])
  return { state, open, typeEnd, advance, close }
}
