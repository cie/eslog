import { Term } from '.'
import Variable from './Variable'

export type WithVariables<S> = ((...vars: Variable[]) => S) | S
export function resolveVariables<S> (x: WithVariables<S>) {
  if (x instanceof Function) return x(...createVariables(x.length))
  else return x
}

let varCounter = 0
export function createVariable () {
  return new Variable(`_${varCounter++}`)
}

export function createVariables (count: number) {
  return Array.from({ length: count }).map(createVariable)
}
