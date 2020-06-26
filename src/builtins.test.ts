import Eslog from '.'
import { and, is } from './builtins'

describe('builtins', () => {
  const el = new Eslog()
  test('and', () => {
    el.check([[4, is, 4], and, [6, is, 6]])
  })
})
