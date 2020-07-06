import { is, solutions, s } from '..'

describe('string pattern', () => {
  test('can be unified', () => {
    solutions(X => is('Hello, World!', s`Hello, ${X} d`))
  })
})
