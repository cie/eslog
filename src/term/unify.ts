export const UNIFY = Symbol('unify')

// important: import submodules after declaring UNIFY, because they use it
import './unify-array'
import Variable from './Variable'
import { Term } from '.'
import stringify from './stringify'

import debug from '../debug'

export default function * unify (a: Term, b: Term) {
  try {
    if (debug.enabled) debug.begin(stringify(a) + '=' + stringify(b))
    if (a instanceof Variable) {
      for (const _ of a[UNIFY](b)) yield
    } else if (b instanceof Variable) {
      for (const _ of b[UNIFY](a)) yield
    } else if (a === null || a === undefined) {
      if (a === b) yield
    } else {
      for (const _ of a[UNIFY](b)) yield
    }
  } finally {
    if (debug.enabled) debug.end()
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
