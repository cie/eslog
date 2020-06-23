import Eslog from '.'

type Person = 'John' | 'Mary'
type Statement = [Person, 'likes', string]

describe('assert', () => {
  let el: Eslog<Statement>
  beforeEach(() => {
    el = new Eslog()
  })
  test('facts', () => {
    el.assert(
      ['Mary', 'likes', 'food'],
      ['Mary', 'likes', 'wine'],
      ['John', 'likes', 'wine'],
      ['John', 'likes', 'Mary']
    )
    expect(el.isTrue(['Mary', 'likes', 'food'])).toBe(true)
    expect(el.isTrue(['John', 'likes', 'food'])).toBe(false)
  })

  test('rules', () => {})
})
