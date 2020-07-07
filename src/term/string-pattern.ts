import { Variable } from '..'
import unify, { UNIFY } from './unify'
import { Term } from '.'

export class StringPattern {
  parts: TemplateStringsArray | string[]
  values: Term[]
  constructor (parts: TemplateStringsArray | string[], ...values: Term[]) {
    if (parts.length === 0) throw new Error('parts must have >0 length')
    this.parts = parts
    this.values = values
  }

  * [UNIFY] (that: unknown) {
    if (that instanceof StringPattern)
      throw new Error(
        'Unifying a StringPattern with a StringPattern is not implemented'
      )
    if (typeof that !== 'string') return
    if (this.parts.length === 1) {
      if (that === this.parts[0]) yield
    } else if (this.parts.length === 2) {
      if (!that.startsWith(this.parts[0])) return
      if (!that.endsWith(this.parts[1])) return
      const start = this.parts[0].length
      const end = that.length - this.parts[1].length
      const val = this.values[0]
      for (const _ of unify(val, that.substring(start, end))) yield
    } else {
      throw new Error('StringPattern with >1 variables is not yet implemented')
    }
  }
}

String.prototype[UNIFY] = function (that: unknown) {
  if (that instanceof StringPattern) return that[UNIFY](this)
  return Object.prototype[UNIFY].apply(this, [that])
}

export function s (parts: TemplateStringsArray, ...values: Term[]) {
  return new StringPattern(parts, ...values)
}
