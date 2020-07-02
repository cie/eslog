import { pred, is, both, isTrue } from '.'

const likes = Symbol('likes')

describe('assert', () => {
  test('facts', () => {
    const likes2 = pred(
      ['Mary', 'food'],
      ['Mary', 'wine'],
      ['John', 'wine'],
      ['John', 'Mary']
    )
    expect(isTrue(likes2('Mary', 'food'))).toBe(true)
    expect(isTrue(likes2('Mary', 'milk'))).toBe(false)
  })

  test('variables', () => {
    const likes2 = pred((X, Y) => is(X, Y))
    expect(isTrue(likes2('Mary', 'Mary'))).toBe(true)
    expect(isTrue(likes2('Mary', 'milk'))).toBe(false)
  })

  test('is', () => {
    expect(isTrue(X => is('Mary', 'Mary'))).toBe(true)
  })
  test('rules', () => {
    const likes2 = pred((A, B) => both(is(A, 'Mary'), is(B, 'food')))
    expect(isTrue(likes2('Mary', 'food'))).toBe(true)
    expect(isTrue(likes2('Mary', 'wine'))).toBe(false)
  })
})
