import { Logical } from '.'
export { default as is } from './term/unify'

export function * both (a: Logical, b: Logical): Logical {
  for (const _ of a) for (const _ of b) yield
}
export function * either (a: Logical, b: Logical): Logical {
  for (const _ of a) yield
  for (const _ of b) yield
}
export function * yes (): Logical {
  yield
}
export function * no (): Logical {}
export function * not (a: Logical): Logical {
  for (const _ of a) return
  yield
}
