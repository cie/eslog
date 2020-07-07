import { solutions, nt, s, any, ATOMS, Term, is } from '.'
describe('dcg', () => {
  test('works', () => {
    const determinant = nt(['a'], ['the'])
    const noun = nt(['cat'], ['mouse'])
    const noun_phrase = nt([determinant, noun])
    const verb = nt(['chases'], ['eats'])
    const sentence = nt([noun_phrase, verb, noun_phrase])

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

  test('with strings', () => {
    const { singular, plural } = ATOMS
    const sentence = (Number: Term) =>
        nt([noun_phrase(Number), verb_phrase(Number)]),
      noun_phrase = (Number: Term) => nt([determiner(Number), noun(Number)]),
      verb_phrase = (Number: Term) => nt([verb(Number), noun_phrase(any())]),
      verb = (Number: Term) => nt([is(Number, singular), 'chases']),
      determiner = (Number: Term) => nt(['the']),
      noun = (Number: Term) => nt(['cat'])
    expect(solutions(X => sentence(singular)(X))).toEqual([
      [['the', 'cat', 'chases', 'the', 'cat']]
    ])
  })
})
