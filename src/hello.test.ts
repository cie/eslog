import Eslog, { is, when } from '.'

const likes = Symbol('likes')

describe('assert', () => {
  let el: Eslog
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
    expect(el.isTrue(X => ['Mary', is, 'Mary'])).toBe(true)
  })
  test('rules', () => {
    el.assert(X => [['Mary', likes, X], when, [X, is, 'food']])
    expect(el.isTrue(X => ['Mary', likes, 'food'])).toBe(true)
    expect(el.isTrue(X => ['Mary', likes, 'wine'])).toBe(false)
  })
})
