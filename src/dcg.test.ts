import { solutions, n } from '.'
describe('dcg', () => {
  test('works', () => {
    const determinant = n(['a'], ['the'])
    const noun = n(['cat'], ['mouse'])
    const noun_phrase = n([determinant, noun])
    const verb = n(['chases'], ['eats'])
    const sentence = n([noun_phrase, verb, noun_phrase])

    expect(solutions(A => noun(A))).toEqual([[['cat']], [['mouse']]])
    expect(solutions(A => noun_phrase(A))).toEqual([
      [['a', 'cat']],
      [['a', 'mouse']],
      [['the', 'cat']],
      [['the', 'mouse']]
    ])

    expect(solutions(A => sentence(A), 7)).toEqual([
      [['a', 'cat', 'chases', 'a', 'cat']],
      [['a', 'cat', 'chases', 'a', 'mouse']],
      [['a', 'cat', 'chases', 'the', 'cat']],
      [['a', 'cat', 'chases', 'the', 'mouse']],
      [['a', 'cat', 'eats', 'a', 'cat']],
      [['a', 'cat', 'eats', 'a', 'mouse']],
      [['a', 'cat', 'eats', 'the', 'cat']]
    ])
  })
})
