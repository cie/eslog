import unify from './unify'
import { Term } from '.'
import { createVariables } from './withVariables'
import stringify from './stringify'
import { is } from '../builtins'
import { ArraySpread } from './unify-array'
import Variable from './Variable'

describe('unify', () => {
  function check (a: Term, b: Term, fn: false | (() => void)) {
    test(stringify([a, is, b]), () => {
      let matched = false
      let unified = false
      for (const _ of unify(a, b)) {
        unified = true
        if (fn && fn()) {
          matched = true
        }
      }
      if (fn && !matched && !unified) throw 'did not unify'
      if (fn && !matched) throw 'did not match'
      if (!fn && unified) throw 'unified'
    })
  }

  const [A, B, C] = createVariables(3)

  check(4, 4, () => true)
  check(4, 5, false)
  check(A, 4, () => A.bound === true && A.value === 4)
  check(A, B, () => A.bound === true && A.value === B && B.bound === false)
  check(A, A, () => A.bound === false)
  check(
    [A, A],
    [B, C],
    () =>
      A.bound === true &&
      A.value === B &&
      B.bound === true &&
      B.value === C &&
      C.bound === false
  )
  check(
    [A, A, A],
    [B, C, 5],
    () =>
      A.bound === true &&
      A.value === B &&
      B.bound === true &&
      B.value === C &&
      C.bound === true &&
      C.value === 5
  )
  check(
    [A, B, C],
    [B, 5, A],
    () =>
      A.bound === true &&
      A.value === B &&
      B.bound === true &&
      B.value === 5 &&
      C.bound === true &&
      C.value === A
  )
  describe('arrays', () => {
    check([[A, B]], [10], false)
    check([[], [[]]], [[], [[]]], () => true)
    check([], [...C], () => eq(C.value, []))
    check([...A], [...B], () => A.value === B)
    check([], [...A], () => eq(A.value, []))
    check([1], [...A], () => eq(A.value, [1]))
    check([1, 2, 5], [...A], () => eq(A.value, [1, 2, 5]))
    check([...A], [], () => eq(A.value, []))
    check([...A], [1], () => eq(A.value, [1]))
    check([...A], [1, 2, 5], () => eq(A.value, [1, 2, 5]))
    check([A, ...B], [1, 2, 5], () => eq(B.value, [2, 5]))
    check([A, ...B], [1, ...C], () => eq(B.value, C))
    check([A, ...B], [1, 2, ...C], () => eq(B.value, [2, ...C]))
    check([1, 2, 5], [A, ...B], () => () => eq(B.value, [2, 5]))
    check([...A], [...B, 5], () => () => eq(A.value, [...B, 5]))
  })
})

function eq (a: unknown, b: unknown): boolean {
  if (a instanceof Array)
    return (
      b instanceof Array &&
      a.length === b.length &&
      a.every((el, i) => eq(el, b[i]))
    )
  if (a instanceof ArraySpread)
    return b instanceof ArraySpread && a.variable === b.variable
  return a === b
}
