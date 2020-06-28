import { Term } from '.'
import Variable from './Variable'
import { createVariable } from './withVariables'
import { DefaultsMap } from '../DefaultsMap'
import { ArraySpread } from './unify-array'

export default function clone<T extends Term> (
  t: T,
  varMap = new DefaultsMap<Variable, Variable>(createVariable)
): T {
  if (t instanceof Array) return t.map(e => clone(e, varMap)) as T
  if (t instanceof Variable) return varMap.get(t) as T
  if (t instanceof ArraySpread)
    return new ArraySpread(clone(t.variable, varMap)) as T
  return t
}
