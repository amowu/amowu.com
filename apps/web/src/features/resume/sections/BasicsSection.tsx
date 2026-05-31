import { Card } from 'animal-island-ui'
import type { Basics } from '@amowu/shared'

export function BasicsSection({ basics }: { basics: Basics }) {
  return (
    <Card color="app-yellow">
      <h1 className="text-3xl font-bold">{basics.name}</h1>
      {basics.label && <p className="text-lg text-gray-700">{basics.label}</p>}
      <p className="text-sm mt-2">
        <a href={`mailto:${basics.email}`}>{basics.email}</a>
        {basics.phone && <> · {basics.phone}</>}
        {basics.url && <> · <a href={basics.url}>{basics.url}</a></>}
      </p>
      {basics.summary && <p className="mt-3">{basics.summary}</p>}
      {basics.profiles.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-3 text-sm">
          {basics.profiles.map((p) => (
            <li key={p.network}>
              <a href={p.url}>{p.network}</a>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}
