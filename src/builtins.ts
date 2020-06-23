import Eslog, { Predicate } from '.'
import unify from './term/unify'
import { Term } from './term'

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
export default BUILTINS
