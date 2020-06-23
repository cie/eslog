import { UNIFY } from './unify'

export type Clause<S> = S

/**
 * @param S the possible types of statement
 */
export default class Eslog<Statement> {
  private clauses: Clause<Statement>[] = []

  assert (...clauses: Clause<Statement>[]) {
    this.clauses.push(...clauses)
    return this
  }
  isTrue (goal: Statement): boolean {
    for (const proof of this.prove(goal)) {
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
