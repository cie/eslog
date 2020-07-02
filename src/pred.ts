import { Term } from './term'
import unify from './term/unify'
import { createVariables } from './term/withVariables'
import Variable from './term/Variable'

export function pred<Args extends Term[]> (
  ...clauses: (Term | ((...args: Args) => Generator<void, void, void>))[]
): (...args: Args) => Generator<void, void, void> {
  return function * (...args: Args) {
    for (const clause of clauses) {
      if (clause instanceof Function) {
        for (const _ of clause(...args)) yield
      } else if (clause instanceof Array) {
        for (const _ of unify(args, clause)) yield
      } else {
        if (args.length === 1) for (const _ of unify(args[0], clause)) yield
      }
    }
  }
}

export function isTrue (
  goal:
    | Generator<void, void, void>
    | ((...args: Variable[]) => Generator<void, void, void>)
) {
  const g =
    goal instanceof Function ? goal(...createVariables(goal.length)) : goal
  for (const _ of g) return true
  return false
}
