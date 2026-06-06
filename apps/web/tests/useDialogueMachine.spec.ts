import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useDialogueMachine } from '../src/features/dialogue/useDialogueMachine'

describe('useDialogueMachine', () => {
  it('starts in idle state', () => {
    const { result } = renderHook(() => useDialogueMachine())
    expect(result.current.state.status).toBe('idle')
  })

  it('open transitions to typing with the requested dialogue', () => {
    const { result } = renderHook(() => useDialogueMachine())
    act(() => result.current.open('n10001'))
    expect(result.current.state.status).toBe('typing')
    expect(result.current.state.activeId).toBe('n10001')
  })

  it('typeEnd from a dialogue without options goes to waitingNext', () => {
    const { result } = renderHook(() => useDialogueMachine())
    act(() => result.current.open('n10001'))
    act(() => result.current.typeEnd())
    expect(result.current.state.status).toBe('waitingNext')
  })

  it('typeEnd from a dialogue with options goes to waitingOption', () => {
    const { result } = renderHook(() => useDialogueMachine())
    act(() => result.current.open('n10002'))
    act(() => result.current.typeEnd())
    expect(result.current.state.status).toBe('waitingOption')
  })

  it('close returns to idle', () => {
    const { result } = renderHook(() => useDialogueMachine())
    act(() => result.current.open('n10001'))
    act(() => result.current.close())
    expect(result.current.state.status).toBe('idle')
    expect(result.current.state.activeId).toBeUndefined()
  })
})
