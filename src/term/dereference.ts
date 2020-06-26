import { Term } from '.'
import Variable from './Variable'
import { ArraySpread } from './unify-array'

export function dereference (t: Term): Term {
  if (t instanceof Variable && t.bound) return dereference(t.value)
  if (t instanceof Array)
    return ([] as Term[]).concat(
      ...t.map(x => {
        if (x instanceof ArraySpread) {
          if (x.variable.bound && x.variable.value instanceof Array)
            return x.variable.value
          else return [x]
        }
        return [dereference(x)]
      })
    )
  return t
}
