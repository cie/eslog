import Procedure from './Procedure'
import { DefaultsMap } from './DefaultsMap'
import { Predicate } from '.'

export default class DB {
  predicatesByFunctor = new DefaultsMap<symbol, Predicate[]>(() => [])
  constructor (predicates: Predicate[]) {
    this.assert(...predicates)
  }
  assert (...predicates: Predicate[]) {
    predicates.forEach(predicate => {
      this.predicatesByFunctor.get(predicate.functor).push(predicate)
    })
  }
  find (functor: symbol) {
    return this.predicatesByFunctor.get(functor)
  }
}
