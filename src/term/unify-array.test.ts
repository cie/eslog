import Eslog, { is } from '..'
import { not_provable } from '../builtins'
describe('unify-array', () => {
  let el: Eslog
  beforeEach(() => {
    el = new Eslog()
  })
  it('unifies empty arrays', () => {
    el.check([[], is, []])
    el.checkFails([[], is, [4]])
  })
})
