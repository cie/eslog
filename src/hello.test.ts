import Eslog, { is, when } from '.'
import { can_be } from './dcg'

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
  test('dcg rules', () => {
    const noun = Symbol('noun')
    const noun_phrase = Symbol('noun_phrase')
    el.assert((A, B) => [[A, noun, B], when, [A, is, ['food', ...B]]])
    el.assert((A, B, C) => [
      [A, noun_phrase, C],
      when,
      [A, is, ['the', ...B]],
      [B, noun, C]
    ])
    expect(el.isTrue(X => [['food'], noun, []])).toBe(true)
    expect(el.isTrue(X => [['food', 'a'], noun, ['a']])).toBe(true)
    expect(el.isTrue(X => [['food', ...X], noun, X])).toBe(true)
    expect(el.isTrue(X => [noun, can_be, ['food']])).toBe(true)
    expect(el.isTrue(X => [noun_phrase, can_be, ['the', 'food']])).toBe(true)
  })
})
