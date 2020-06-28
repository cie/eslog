import Eslog from '.'
import stringify from './term/stringify'
import { can_be, translateTerm } from './dcg'
import { createVariables } from './term/withVariables'
import { Term } from './term'
import Variable from './term/Variable'
import { is } from './builtins'
import Procedure from './Procedure'
import Debug from 'debug'

const Nonterminals = new Proxy<{ [s: string]: symbol }>(
  {},
  {
    get (t, propertyKey) {
      if (typeof propertyKey === 'string') return Symbol(propertyKey)
    }
  }
)
describe('translateTerm', () => {
  const [A, B, C] = createVariables(3)
  const noun = Symbol()
  function test (
    term: Term,
    Input: Term[] | Variable,
    Rest: Term[] | Variable,
    expected: Term
  ) {
    it(stringify(term), () =>
      expect(translateTerm(term, Input, Rest)).toEqual(expected)
    )
  }
  test(noun, ['world'], [], [['world'], noun, []])
  test(
    ['hello'],
    ['hello', 'world'],
    ['world'],
    [['hello', 'world'], is, ['hello', 'world']]
  )
  test(['hello'], A, B, [A, is, ['hello', ...B]])
  test(['hello'], A, B, [A, is, ['hello', ...B]])
})

describe('dcg', () => {
  let el: Eslog
  beforeEach(() => {
    el = new Eslog()
  })
  test('works', () => {
    const { noun_phrase, noun, determinant, verb, sentence } = Nonterminals
    el.assert(
      [noun_phrase, can_be, determinant, noun],
      [determinant, can_be, ['a']],
      [determinant, can_be, ['the']],
      [noun, can_be, ['cat']],
      [noun, can_be, ['mouse']],
      [verb, can_be, ['chases']],
      [verb, can_be, ['eats']],
      [sentence, can_be, noun_phrase, verb, noun_phrase]
    )
    expect(el.solve(A => [noun, can_be, A])).toEqual([[['cat']], [['mouse']]])
    expect(el.solve(A => [noun_phrase, can_be, A])).toEqual([
      [['a', 'cat']],
      [['a', 'mouse']],
      [['the', 'cat']],
      [['the', 'mouse']]
    ])

    return
    expect(el.solve(A => [sentence, can_be, A])).toEqual([
      [['a', 'cat', 'chases', 'a', 'cat']],
      [['a', 'cat', 'chases', 'a', 'mouse']],
      [['a', 'cat', 'chases', 'the', 'cat']],
      [['a', 'cat', 'chases', 'the', 'mouse']],
      [['a', 'cat', 'eats', 'a', 'cat']],
      [['a', 'cat', 'eats', 'a', 'mouse']],
      [['a', 'cat', 'eats', 'the', 'cat']]
    ])
  })
})
