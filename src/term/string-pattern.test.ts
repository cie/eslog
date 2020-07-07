import { is, solutions, s } from '..'

describe('string pattern', () => {
  test('can be unified', () => {
    expect(solutions(X => is('Hello, World!', s`Hello, ${X}!`))).toEqual([
      ['World']
    ])
  })
  test('can be dereferenced', () => {
    expect(solutions(X => is(X, s`Hello, ${'World'}!`))).toEqual([
      ['Hello, World!']
    ])
  })
})
