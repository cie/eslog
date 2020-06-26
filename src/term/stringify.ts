import { Term } from '.'
import Variable from './Variable'

export default function stringify (t: Term): string {
  if (t === null) return 'null'
  if (t === undefined) return 'undefined'
  if (typeof t === 'symbol') return String(t).slice(7, -1)
  if (t instanceof Array) return `[${t.map(stringify).join(', ')}]`
  if (t instanceof Variable) return t.name
  return JSON.stringify(t)
}
