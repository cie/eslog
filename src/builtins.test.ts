import { pred, both, is, solutions } from '.'
import { isTrue } from './pred'

describe('builtins', () => {
  test('and', () => {
    const p = pred(() => both(is(4, 4), is(6, 6)))
    expect(isTrue(p())).toEqual(true)
  })
})
