import { Term } from '.'
import Variable from './Variable'
import { ArraySpread } from './unify-array'

export default function stringify (t: unknown): string {
  if (t === null) return 'null'
  if (t === undefined) return 'undefined'
  if (typeof t === 'symbol') return String(t).slice(7, -1)
  if (t instanceof Array) return `[${t.map(stringify).join(', ')}]`
  if (t instanceof Variable) return t.name
  if (t instanceof ArraySpread) return `...${stringify(t.variable)}`
  return JSON.stringify(t)
}
