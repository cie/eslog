import { Builtin, is } from './builtins'
import { Term } from './term'
import Procedure from './Procedure'
import Variable from './term/Variable'
import { createVariables } from './term/withVariables'
import stringify from './term/stringify'

export const can_be = Symbol('can_be')

export function translateTerm (
  term: Term,
  Input: Term,
  Rest: Variable | Term[]
) {
  if (typeof term === 'symbol') return [Input, term, Rest]
  if (term instanceof Array) return [Input, is, [...term, ...Rest]] // ??? what if nonterminals have paramters???
  throw new Error('invalid term in dcg: ' + stringify(term))
}

export function translateDCGRule (nonterminal: Term, ...terms: Term[]) {
  const vars = createVariables(terms.length + 1)
  const head = translateTerm(nonterminal, vars[0], vars[terms.length])
  const body = terms.map((term, i) => translateTerm(term, vars[i], vars[i + 1]))
  return new Procedure(head, ...body)
}

export const DCG_BUILTINS = [
  new Builtin(can_be, function * (el, nonterminal, Input) {
    const goal = translateTerm(nonterminal, Input, [])
    for (const _ of el.prove(goal)) yield
  })
]
