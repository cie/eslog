import unify, { UNIFY } from './term/unify'
import Variable from './term/Variable'

export type WithVariables<S> = ((...vars: any) => S) | S

declare global {
  interface Array<T> {
    if<P>(...stmts: P[]): Procedure<P>
  }
}

export function * or<P> (this: Eslog<P>, a: Statement<P>, b: Statement<P>) {
  for (const _ of this.prove(a)) yield
  for (const _ of this.prove(b)) yield
}
export function * not<P> (this: Eslog<P>, a: Statement<P>) {
  for (const _ of this.prove(a)) return
  yield
}

export const when = Symbol('when')
export const and = Symbol('and')
export const or = Symbol('or')
export const is = Symbol('is')
export const fails = Symbol('fails')

type Builtins<P> = {}

export type Call<Fn> = Fn extends (arg1: infer A1, ...args: infer AS) => any
  ? [A1, Fn, AS]
  : never
export type Statement<P> = P | BuiltinStatement<P> | true
export type BuiltinStatement<P> =
  | [Statement<P>, typeof and, Statement<P>]
  | [Statement<P>, typeof and, Statement<P>]

export type ClauseDeclaration<P> = FactDeclaration<P> | RuleDeclaration<P>
export type FactDeclaration<P> = P
export type RuleDeclaration<P> = [P, typeof when, Statement<P>]

function parseDeclaration<P> (x: ClauseDeclaration<P>): Procedure<P> {
  if (x instanceof Array && x[1] === when)
    return new Procedure(x[0], ...(x.slice(2) as P[]))
  return new Procedure(x as P)
}

interface Predicate<P> {
  prove(goal: Statement<P>, el: Eslog<P>): Generator<void, void, void>
}

/**
 * @param P the possible types of statement
 */
export default class Eslog<P> {
  private predicates: Predicate<P>[] = [new And()]
  assert (...clauses: WithVariables<ClauseDeclaration<P>>[]) {
    this.predicates.push(...clauses.map(resolveVariables).map(parseDeclaration))
    return this
  }
  isTrue (goal: WithVariables<Statement<P>>): boolean {
    for (const _ of this.prove(resolveVariables(goal))) return true
    return false
  }
  * prove (goal: Statement<P>) {
    for (const pred of this.predicates)
      for (const _ of pred.prove(goal, this)) yield
  }
}

export class Procedure<P> implements Predicate<P> {
  head: P
  body: Statement<P>
  constructor (head: P, ...body: Statement<P>[]) {
    this.head = head
    this.body = body.reduce((a, b) => [a, and, b] as any, true)
  }
  * prove (goal: Statement<P>, el: Eslog<P>) {
    for (const _ of unify(this.head, goal))
      for (const _ of el.prove(this.body)) yield
  }
}

export class And<P> implements Predicate<P> {
  * prove (goal: Statement<P>, el: Eslog<P>) {
    for (const _ of this.prove(a)) for (const _ of this.prove(b)) yield
  }
}

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
