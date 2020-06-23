import { UNIFY } from './term/unify'
import Variable from './term/Variable'

export type Fact<Stmt> = Stmt
export type Clause<Stmt> = Fact<Stmt>
export type WithVariables<S> = ((...vars: any) => S) | S

/**
 * @param Stmt the possible types of statement
 */
export default class Eslog<Stmt> {
  private clauses: Clause<Stmt>[] = []
  private varCounter = 0
  assert (...clauses: WithVariables<Clause<Stmt>>[]) {
    this.clauses.push(...clauses.map(this.resolveVariables))
    return this
  }
  isTrue (goal: WithVariables<Stmt>): boolean {
    for (const _ of this.prove(this.resolveVariables(goal))) return true
    return false
  }
  * prove (goal: Stmt) {
    for (const fact of this.clauses)
      for (const _ of (fact as any)[UNIFY](goal)) yield
  }
  resolveVariables = <S>(x: WithVariables<S>) => {
    if (x instanceof Function) return x(...this.createVariables(x.length))
    else return x
  }
  createVariables (count: number) {
    return Array.from({ length: count }).map(
      () => new Variable(`_${this.varCounter++}`)
    )
  }
}
