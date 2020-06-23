export const UNIFY = Symbol('unify')

// important: import submodules after declaring UNIFY, because they use it
import './unify-array'
import Variable from './Variable'

export default function * unify (a: unknown, b: unknown) {
  if (a instanceof Variable) {
    for (const _ of a.unify(b)) yield
  } else if (b instanceof Variable) {
    for (const _ of b.unify(a)) yield
  } else if (a === null || a === undefined) {
    if (a === b) yield
  } else {
    for (const _ of (a as any)[UNIFY](b)) yield
  }
}

Object.prototype[UNIFY] = function * (that: unknown) {
  if (this === that) yield
}

declare global {
  interface Object {
    [UNIFY]: (that: unknown) => Generator<void, void, void>
  }
}
