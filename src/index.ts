import BUILTINS from './builtins'
import { Term } from './term'
export * from './builtins'
import {
  WithVariables,
  resolveVariables,
  createVariables
} from './term/withVariables'
export { WithVariables, resolveVariables } from './term/withVariables'
import Procedure from './Procedure'
import stringify from './term/stringify'
import { dereference } from './term/dereference'
import { translateDCGRule, can_be, DCG_BUILTINS } from './dcg'
export { can_be } from './dcg'
import debug from './debug'

export const when = Symbol('when')

export type Clause = Fact | Rule
export type Fact = Term
export type Rule = [Term, typeof when, ...Term[]]
export type Goal = Term

function parseClause (x: Clause): Procedure {
  if (x instanceof Array && x[1] === when)
    return new Procedure(x[0], ...x.slice(2))
  if (x instanceof Array && x[1] === can_be)
    return translateDCGRule(x[0], ...x.slice(2))
  return new Procedure(x)
}

export interface Predicate {
  prove(goal: Term, el: Eslog): Generator<void, void, void>
}

export default class Eslog {
  predicates: Predicate[] = [...BUILTINS, ...DCG_BUILTINS]
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
  * map<A> (goal: Term, fn: () => A) {
    for (const _ of this.prove(goal)) {
      const result = fn()
      if (debug.enabled) debug(`YES: ${stringify(result)}`)
      yield result
    }
  }
  solve (goal: WithVariables<Goal>): any[][] {
    if (!(goal instanceof Function)) return [...this.prove(goal)].map(() => [])
    const vars = createVariables(goal.length)
    return [...this.map(goal(...vars), () => vars.map(dereference))]
  }
}
