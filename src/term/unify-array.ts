import unify, { UNIFY } from './unify'
import Variable from './Variable'
import { createVariable } from './withVariables'

export class ArraySpread {
  variable: Variable
  constructor (variable: Variable) {
    this.variable = variable
  }
}

Array.prototype[UNIFY] = function * (that: unknown) {
  if (!(that instanceof Array)) return
  if (this.length === 0) {
    if (that.length === 0) yield
    else if (that[0] instanceof ArraySpread)
      for (const _ of unify([], that[0].variable))
        for (const _ of unify([], that.slice(1))) yield
  } else if (this[0] instanceof ArraySpread) {
    if (
      this.length === 1 &&
      that.length === 1 &&
      that[0] instanceof ArraySpread
    )
      for (const _ of unify(this[0].variable, that[0].variable)) yield
    else if (this.length === 1)
      for (const _ of unify(this[0].variable, that)) yield
    else {
      for (const _ of unify(this[0].variable, []))
        for (const _ of unify(this.slice(1), that)) yield
      const part = [createVariable(), new ArraySpread(createVariable())]
      for (const _ of unify(this[0].variable, part))
        for (const _ of unify([...part, ...this.slice(1)], that)) yield
    }
  } else {
    if (that.length === 0) {
      // no match
    } else if (that[0] instanceof ArraySpread) {
      for (const _ of unify(that, this)) yield
    } else {
      for (const _ of unify(this[0], that[0]))
        for (const _ of this.slice(1)[UNIFY](that.slice(1))) yield
    }
  }
}
