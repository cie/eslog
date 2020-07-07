import { Term } from './term'
import Variable from './term/Variable'
import {
  WithVariables,
  resolveVariables,
  createVariable
} from './term/withVariables'
import { Logical } from '.'
import unify from './term/unify'

export type Terms = Term[] | Variable
export type Nonterminal = (Input: Terms | Variable, Rest?: Terms) => Logical
export type Production = WithVariables<(Term | Nonterminal | Logical)[]>
export function nt (...productions: Production[]): Nonterminal {
  return function * (Input, Rest = []) {
    for (const prod of productions.map(resolveVariables)) {
      for (const _ of substitute(prod, Input, Rest)) yield
    }
  }
}

function * substitute (
  prod: (Term | Nonterminal | Logical)[],
  Input: Terms,
  Rest: Terms
) {
  if (prod.length === 0) for (const _ of unify(Input, Rest)) yield
  else {
    const sym = prod[0]
    if (isLogical(sym)) {
      for (const _ of sym)
        for (const _ of substitute(prod.slice(1), Input, Rest)) yield
    } else {
      const R1 = createVariable()
      const match =
        sym instanceof Function
          ? sym(Input, [...R1])
          : unify([sym, ...R1], Input)
      for (const _ of match)
        for (const _ of substitute(prod.slice(1), [...R1], Rest)) yield
    }
  }
}

function isLogical (sym: unknown): sym is Logical {
  return typeof sym === 'object' && sym !== null && Symbol.iterator in sym
}
