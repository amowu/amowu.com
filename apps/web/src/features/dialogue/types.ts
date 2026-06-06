export type DialogueNext =
  | { kind: 'dialogue'; id: string }
  | { kind: 'route'; to: '/' | '/resume' }
  | { kind: 'url'; href: string }
  | { kind: 'options'; items: ReadonlyArray<{ label: string; next: DialogueNext }> }
  | { kind: 'close' }

export type DialogueNode = { text: string; next: DialogueNext }
