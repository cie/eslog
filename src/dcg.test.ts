import { solutions, nt, s, any, ATOMS, Term, is, Variable } from '.'
import Debugger from 'debug'
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

  test('with parameters', () => {
    const { singular, plural } = ATOMS
    type Num = typeof singular | typeof plural | Variable
    const sentence = (N: Num) => nt(() => [noun_phrase(N), verb_phrase(N)]),
      noun_phrase = (N: Num) => nt(() => [determiner(N), noun(N)]),
      verb_phrase = (N: Num) => nt(() => [verb(N), noun_phrase(any())]),
      verb = (N: Num) =>
        nt(
          () => [is(N, singular), 'chases'],
          () => [is(N, plural), 'chase']
        ),
      determiner = (N: Num) =>
        nt(
          () => ['the'],
          () => [is(N, singular), 'a'],
          () => [is(N, plural)]
        ),
      noun = (N: Num) =>
        nt(
          () => [is(N, plural), 'cats'],
          () => [is(N, singular), 'cat']
        )
    expect(solutions(X => noun(any())(X))).toEqual([[['cats']], [['cat']]])
    expect(solutions(X => determiner(singular)(X))).toEqual([
      [['the']],
      [['a']]
    ])
    expect(solutions(X => determiner(plural)(X))).toEqual([[['the']], [[]]])
    expect(solutions(X => determiner(any())(X))).toEqual([
      [['the']],
      [['a']],
      [[]]
    ])
    expect(solutions(X => noun_phrase(singular)(X))).toEqual([
      [['the', 'cat']],
      [['a', 'cat']]
    ])
    expect(
      solutions(X => sentence(any())(X)).map(([x]) => (x as string[]).join(' '))
    ).toEqual([
      'the cats chase the cats',
      'the cats chase the cat',
      'the cats chase a cat',
      'the cats chase cats',
      'the cat chases the cats',
      'the cat chases the cat',
      'the cat chases a cat',
      'the cat chases cats',
      'a cat chases the cats',
      'a cat chases the cat',
      'a cat chases a cat',
      'a cat chases cats',
      'cats chase the cats',
      'cats chase the cat',
      'cats chase a cat',
      'cats chase cats'
    ])
  })
})
