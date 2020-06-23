import { UNIFY } from '.'

Array.prototype[UNIFY] = function * (that: unknown) {
  if (!(that instanceof Array)) {
    for (const binding of Object.getPrototypeOf(this)[UNIFY](that)) {
      yield binding
    }
  } else if (this.length === 0) {
    if (that.length === 0) {
      yield
    }
  } else {
    if (that.length === 0) {
      // don't yield
    } else {
      for (const binding of this[0][UNIFY](that[0])) {
        for (const binding2 of this.slice(1)[UNIFY](that.slice(1))) {
          yield
        }
      }
    }
  }
}
