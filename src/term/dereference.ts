import { Term } from '.'
import Variable from './Variable'
import { ArraySpread } from './unify-array'

export function dereference (t: Term): Term {
  if (t instanceof Variable && t.bound) return dereference(t.value)
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
