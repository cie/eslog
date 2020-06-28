import { Term } from './term'
import Eslog, { Predicate } from '.'
import { and, true_ } from './builtins'
import unify from './term/unify'
import stringify from './term/stringify'

import debug from './debug'

export default class Procedure implements Predicate {
  head: Term
  body: Term
  functor: symbol
  constructor (head: Term, ...body: Term[]) {
    this.head = head
    this.functor = functorOf(head)
    this.body = body.length ? body.reduce((a, b) => [a, and, b] as any) : true_
  }
  * prove (goal: Term, el: Eslog) {
    for (const _ of unify(this.head, goal)) {
      try {
        debug.begin(stringify(this.head))
        for (const _ of el.prove(this.body)) {
          try {
            debug.begin('when ' + stringify(this.body))
            yield
          } finally {
            debug.end()
          }
        }
      } finally {
        debug.end()
      }
    }
  }
}

export function functorOf (t: Term) {
  const functor = t instanceof Array ? t[1] : t
  if (typeof functor !== 'symbol') error('term or term[1] nust be a symbol')
  return functor
}

function error (msg: string): never {
  throw new Error(msg)
}
