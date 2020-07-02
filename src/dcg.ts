import { Builtin, is } from './builtins'
import { Term } from './term'
import Procedure from './Procedure'
import Variable from './term/Variable'
import {
  createVariables,
  WithVariables,
  resolveVariables,
  createVariable
} from './term/withVariables'
import stringify from './term/stringify'
import { LogicalValue } from '.'
import unify from './term/unify'

export const can_be = Symbol('can_be')

export function translateTerm (
  term: Term,
  Input: Term | Variable,
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

type Terms = Term[] | Variable
type Nonterminal = (Input: Terms | Variable, Rest?: Terms) => LogicalValue
type Production = WithVariables<(Term | Nonterminal)[]>
export function n (...productions: Production[]): Nonterminal {
  return function * (Input, Rest = []) {
    for (const prod of productions.map(resolveVariables)) {
      for (const _ of substitute(prod, Input, Rest)) yield
    }
  }
}

function * substitute (
  prod: (Term | Nonterminal)[],
  Input: Terms,
  Rest: Terms
) {
  if (prod.length === 0) for (const _ of unify(Input, Rest)) yield
  else {
    const sym = prod[0]
    const R1 = createVariable()
    const match =
      sym instanceof Function ? sym(Input, [...R1]) : unify([sym, ...R1], Input)
    for (const _ of match)
      for (const _ of substitute(prod.slice(1), [...R1], Rest)) yield
  }
}
