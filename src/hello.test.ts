import Eslog from '.'

type Person = 'John' | 'Mary'
const hasLength = Symbol()
type Statement =
  | [Person, typeof likes, string]
  | [unknown[], typeof hasLength, number]
const likes = Symbol()
const is = Symbol()

describe('assert', () => {
  let el: Eslog<Statement>
  beforeEach(() => {
    el = new Eslog()
  })
  test('facts', () => {
    el.assert(
      ['Mary', likes, 'food'],
      ['Mary', likes, 'wine'],
      ['John', likes, 'wine'],
      ['John', likes, 'Mary']
    )
    expect(el.isTrue(['Mary', likes, 'food'])).toBe(true)
    expect(el.isTrue(['John', likes, 'food'])).toBe(false)
  })

  test('variables', () => {
    el.assert(X => [X, likes, X])
    expect(el.isTrue(['Mary', likes, 'Mary'])).toBe(true)
    expect(el.isTrue(X => ['Mary', X, 'Mary'])).toBe(true)
    expect(el.isTrue(X => ['Mary', X, 'Joe'])).toBe(false)
  })

  test('is', () => {
    expect(el.isTrue(X => ['Mary', is, 'Mary'])).toBe(false)
  })

  test('rules', () => {})
})
