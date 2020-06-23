import { Term } from '.'
import Variable from './Variable'

export type WithVariables<S> = ((...vars: Term[]) => S) | S
export function resolveVariables<S> (x: WithVariables<S>) {
  if (x instanceof Function) return x(...createVariables(x.length))
  else return x
}

let varCounter = 0
function createVariables (count: number) {
  return Array.from({ length: count }).map(
    () => new Variable(`_${varCounter++}`)
  )
}
