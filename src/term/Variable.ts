import unify, { UNIFY } from './unify'
import { ArraySpread } from './unify-array'
import { Term } from '.'

export default class Variable {
  name: string
  bound = false
  value: Term

  constructor (name: string) {
    this.name = name
  }

  * [UNIFY] (value: Term) {
    if (value === this) {
      yield
    } else if (!this.bound) {
      try {
        this.bound = true
        this.value = value
        yield
      } finally {
        this.bound = false
        this.value = undefined
      }
    } else {
      for (const _ of unify(this.value, value)) yield
    }
  }

  [Symbol.iterator] (): Iterator<ArraySpread> {
    return [new ArraySpread(this)][Symbol.iterator]()
  }

  get dereferenced () {
    return this.bound ? this.value : this
  }
}
