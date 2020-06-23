import unify, { UNIFY } from './unify'

Array.prototype[UNIFY] = function * (that: unknown) {
  if (!(that instanceof Array)) return
  else if (this.length === 0 && that.length === 0) yield
  else if (this.length > 0 && that.length > 0) {
    for (const _ of unify(this[0], that[0]))
      for (const _ of this.slice(1)[UNIFY](that.slice(1))) yield
  }
}
