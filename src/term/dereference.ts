import { Term } from '.'
import Variable from './Variable'
import { ArraySpread } from './unify-array'
import { StringPattern } from './string-pattern'

export function dereference (t: Term): Term {
  if (t instanceof Variable) return t.dereference()
  if (t instanceof StringPattern) return t.dereference()
  if (t instanceof Array)
    return ([] as Term[]).concat(
      ...t.map(x => {
        if (x instanceof ArraySpread && x.variable.bound) {
          const value = dereference(x.variable)
          if (!(value instanceof Array))
            throw new Error(
              `Cannot dereference array spread with non-array value: ${x.variable.name}`
            )
          return value.map(dereference)
        }
        return [dereference(x)]
      })
    )
  return t
}
