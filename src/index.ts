import BUILTINS from './builtins'
import { Term } from './term'
export * from './builtins'
import { WithVariables, resolveVariables } from './term/withVariables'
export { WithVariables, resolveVariables } from './term/withVariables'
import Procedure from './Procedure'
import stringify from './term/stringify'

export const when = Symbol('when')
export type Clause = Fact | Rule
export type Fact = Term
export type Rule = [Term, typeof when, ...Term[]]
export type Goal = Term

function parseClause (x: Clause): Procedure {
  if (x instanceof Array && x[1] === when)
    return new Procedure(x[0], ...x.slice(2))
  return new Procedure(x)
}

export interface Predicate {
  prove(goal: Term, el: Eslog): Generator<void, void, void>
}

/**
 * @param P the possible types of statement
 */
export default class Eslog {
  private predicates: Predicate[] = [...BUILTINS]
  assert (...clauses: WithVariables<Clause>[]) {
    this.predicates.push(...clauses.map(resolveVariables).map(parseClause))
    return this
  }
  isTrue (goal: WithVariables<Goal>): boolean {
    for (const _ of this.prove(resolveVariables(goal))) return true
    return false
  }
  check (...goals: WithVariables<Goal>[]) {
    for (const goal of goals) {
      if (!this.isTrue(goal))
        throw new Error(stringify(resolveVariables(goal)) + ' failed')
    }
  }
  checkFails (...goals: WithVariables<Goal>[]) {
    for (const goal of goals) {
      if (this.isTrue(goal))
        throw new Error(stringify(resolveVariables(goal)) + ' did not fail')
    }
  }
  * prove (goal: Term) {
    for (const pred of this.predicates) {
      for (const _ of pred.prove(goal, this)) {
        yield
      }
    }
  }
}
