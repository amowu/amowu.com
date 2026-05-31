import type { ReactNode } from 'react'
import { Modal, Typewriter } from 'animal-island-ui'

type Props = {
  open: boolean
  text: string
  onTypeEnd: () => void
  children?: ReactNode
  onClose: () => void
}

// NOTE: animal-island-ui's Typewriter renders ReactNode char-by-char and would
// not faithfully animate raw HTML strings passed via dangerouslySetInnerHTML.
// Old dialogue text contains semantic HTML (e.g. <mark>, <ruby>, <span style>),
// so we strip tags for the animated render and accept the loss of inline styling
// during the typing animation. The Modal `typewriter` prop is disabled because
// we drive the effect via Typewriter (which exposes onDone).
function stripHtml(html: string): string {
  return html
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<br\s*\/?>(?:\s*)/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

export function DialogueBox({ open, text, onTypeEnd, children, onClose }: Props) {
  const plain = stripHtml(text)
  return (
    <Modal open={open} onClose={onClose} typewriter={false} footer={null}>
      <div className="whitespace-pre-wrap">
        <Typewriter speed={30} trigger={text} onDone={onTypeEnd}>
          {plain}
        </Typewriter>
      </div>
      {children}
    </Modal>
  )
}
