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
      for (const solution of this.unify(fact, goal)) {
        yield solution
      }
    }
  }
  * unify (a: any, b: any) {
    if (a === b) {
      yield
    } else if (a instanceof Array && b instanceof Array) {
      if (a.length === 0) {
        if (b.length === 0) {
          yield
        } else {
          // don't yield
        }
      } else {
        if (b.length === 0) {
          // don't yield
        } else {
          for (const binding of this.unify(a[0], b[0])) {
            for (const binding2 of this.unify(a.slice(1), b.slice(1))) {
              yield
            }
          }
        }
      }
    } else {
      // don't yield
    }
  }
}
