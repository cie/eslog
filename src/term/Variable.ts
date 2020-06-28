import unify, { UNIFY } from './unify'
import { ArraySpread } from './unify-array'
import { Term } from '.'
import stringify from './stringify'
import debug from '../debug'

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
        if (debug.enabled) debug.begin(`${this.name}=${stringify(value)}`)
        this.bound = true
        this.value = value
        yield
      } finally {
        this.bound = false
        this.value = undefined
        if (debug.enabled) debug.end()
      }
    } else {
      for (const _ of unify(this.value, value)) yield
    }
  }

  [Symbol.iterator] (): Iterator<ArraySpread> {
    return [new ArraySpread(this)][Symbol.iterator]()
  }
}
