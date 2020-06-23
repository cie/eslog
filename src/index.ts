import unify, { UNIFY } from './term/unify'
import Variable from './term/Variable'

export type WithVariables<S> = ((...vars: Term[]) => S) | S
function resolveVariables<S> (x: WithVariables<S>) {
  if (x instanceof Function) return x(...createVariables(x.length))
  else return x
}
let varCounter = 0
function createVariables (count: number) {
  return Array.from({ length: count }).map(
    () => new Variable(`_${varCounter++}`)
  )
}

export type Term = symbol | string | number | boolean | Term[] | Variable

export type Clause = Fact | Rule
export type Fact = Term
export type Rule = [Term, typeof when, ...Term[]]

function parseClause (x: Clause): Procedure {
  if (x instanceof Array && x[1] === when)
    return new Procedure(x[0], ...x.slice(2))
  return new Procedure(x)
}

interface Predicate {
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
  isTrue (goal: WithVariables<Term>): boolean {
    for (const _ of this.prove(resolveVariables(goal))) return true
    return false
  }
  * prove (goal: Term) {
    for (const pred of this.predicates) {
      for (const _ of pred.prove(goal, this)) {
        yield
      }
    }
  }
}

export class Procedure implements Predicate {
  head: Term
  body: Term
  constructor (head: Term, ...body: Term[]) {
    this.head = head
    this.body = body.length ? body.reduce((a, b) => [a, and, b] as any) : true_
  }
  * prove (goal: Term, el: Eslog) {
    for (const _ of unify(this.head, goal))
      for (const _ of el.prove(this.body)) yield
  }
}

export class Builtin implements Predicate {
  constructor (
    private key: symbol,
    private fn: (el: Eslog, ...args: Term[]) => Generator<void, void, void>
  ) {}
  * prove (goal: Term, el: Eslog) {
    if (goal === this.key) {
      for (const _ of this.fn(el)) yield
    } else if (goal instanceof Array && goal[1] === this.key) {
      for (const _ of this.fn(el, goal[0], ...goal.slice(2))) yield
    }
  }
}

export const when = Symbol('when')
export const and = Symbol('and')
export const or = Symbol('or')
export const is = Symbol('is')
export const fails = Symbol('fails')
export const true_ = Symbol('true_')

const BUILTINS = [
  new Builtin(and, function * (el: Eslog, a: Term, b: Term) {
    for (const _ of el.prove(a)) for (const _ of el.prove(b)) yield
  }),
  new Builtin(true_, function * (el: Eslog) {
    yield
  }),
  new Builtin(is, function * (el: Eslog, a: Term, b: Term) {
    for (const _ of unify(a, b)) yield
  }),
  new Builtin(or, function * (el: Eslog, a: Term, b: Term) {
    for (const _ of el.prove(a)) yield
    for (const _ of el.prove(b)) yield
  }),
  new Builtin(fails, function * (el: Eslog, a: Term) {
    for (const _ of el.prove(a)) return
    yield
  })
]
