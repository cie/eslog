import { UNIFY } from './term/unify'
import Variable, { WithVariables } from './term/Variable'

export type Clause<S> = S

/**
 * @param S the possible types of statement
 */
export default class Eslog<Statement> {
  private clauses: Clause<Statement>[] = []

  assert (...clauses: WithVariables<Clause<Statement>>[]) {
    this.clauses.push(...clauses.map(resolveVariables))
    return this
  }
  isTrue (goal: WithVariables<Statement>): boolean {
    for (const proof of this.prove(resolveVariables(goal))) {
      return true
    }
    return false
  }
  * prove (goal: Statement) {
    for (const fact of this.clauses) {
      for (const solution of (fact as any)[UNIFY](goal)) {
        yield solution
      }
    }
  }
}

function resolveVariables<S> (x: WithVariables<S>) {
  if (!(x instanceof Function)) return x
  const argCount = x.length
  const args = Array.from({ length: argCount }).map(
    (_, i) => new Variable(`_${i}`)
  )
  return x(...args)
}
