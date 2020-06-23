export const UNIFY = Symbol('unify')
// important: import submodules after declaring unify, because they use it
import './unify-array'

declare global {
  interface Object {
    [UNIFY]: (that: unknown) => Generator
  }
}

Object.prototype[UNIFY] = function * (that: unknown) {
  if (this === that) {
    yield
  }
}
