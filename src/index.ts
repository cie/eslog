import { Term } from './term'
import { WithVariables, createVariables } from './term/withVariables'
import stringify from './term/stringify'
import { dereference } from './term/dereference'
import debug from './debug'

export { WithVariables, resolveVariables } from './term/withVariables'
export * from './dcg'
export * from './builtins'
export * from './pred'

export type Logical = Generator<void, void, void>

export function solutions (
  goal: WithVariables<Logical>,
  max = Infinity
): Term[][] {
  if (!(goal instanceof Function)) return [...goal].map(() => [])
  const vars = createVariables(goal.length)
  const result = []
  for (const _ of goal(...vars)) {
    if (debug.enabled) debug(`YES: ${stringify(result)}`)
    result.push(vars.map(dereference))
    if (result.length === max) return result
  }
  return result
}
