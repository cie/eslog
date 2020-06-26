import Eslog, { is } from '..'
import { not_provable, and } from '../builtins'
describe('unify-array', () => {
  let el: Eslog
  beforeEach(() => {
    el = new Eslog()
  })
  it('unifies two arrays with splats at the first element', () => {
    el.check((A, B) => [[...A], is, [...B, 5]])
    el.solve((A, B) => [[...A], is, [...B, 5]]).forEach(([A, B]) => {
      expect(A).toEqual([...B, 5])
    })
  })
  /*
  it('unififes first spread with first non-spread', () => {
    el.check(C => [[1], is, [...C]])
    el.solve(C => [[1], is, [...C]]).forEach(([C]) => {
      expect(C).toEqual([1])
    })
    el.check(C => [[...C], is, [1]])
    el.solve(C => [[...C], is, [1]]).forEach(([C]) => {
      expect(C).toEqual([1])
    })
    el.solve((A, X, C) => [[2, 3, 4], is, [...C]]).forEach(([, X, C]) => {
      expect(C).toEqual([2, 3, 4])
    })
    el.solve((X, C) => [[2], is, [...C]]).forEach(([X, C]) => {
      expect(X).toEqual(1)
      expect(C).toEqual([2, 3, 4])
    })
    el.solve((X, C) => [[1, 2, 3, 4], is, [...C, X]]).forEach(([X, C]) => {
      expect(X).toEqual(4)
      expect(C).toEqual([1, 2, 3])
    })
    /*el.solve((A, X, C) => [
      [A, is, [1, 2, 3]],
      and,
      [[...A, 4], is, [X, ...C]]
    ]).forEach(([A, X, C]) => {
      expect(X).toEqual(1)
      expect(C).toEqual([2, 3, 4])
    })*/
  //})
})
