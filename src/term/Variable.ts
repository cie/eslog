import unify from './unify'

export default class Variable {
  name: string
  bound = false
  value: unknown

  constructor (name: string) {
    this.name = name
  }

  * unifyWith (value: unknown) {
    if (!this.bound) {
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
}
