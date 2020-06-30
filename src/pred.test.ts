type term = string | number

function pred<Args extends term[]> (
  ...clauses: (term | Args | ((...args: Args) => boolean))[]
) {
  const fns = clauses.map(clause =>
    clause instanceof Function
      ? clause
      : clause instanceof Array
      ? (...args: Args) =>
          args.length === clause.length &&
          args.every((arg, i) => arg === clause[i])
      : (...args: Args) => args.length === 1 && args[0] === clause
  )
  return function (...args: Args) {
    return fns.some(fn => fn(...args))
  }
}

function solve<Args extends term[]> (goal: (...args: Args) => boolean) {
  return goal(...([] as any)) ? [[]] : []
}

function is (a: term, b: term) {
  return a === b
}

describe('pred', () => {
  test('yes', () => {
    const yes = pred(() => true)
    expect(yes()).toBe(true)
  })
  test('no', () => {
    const no = pred(() => false)
    expect(no()).toBe(false)
  })
  test('rules', () => {
    const even = pred((N: number) => N % 2 === 0)
    expect(even(1)).toBe(false)
    expect(even(4)).toBe(true)
  })
  test('facts', () => {
    const man = pred('socrates')
    expect(man('beer')).toBe(false)
    expect(man('socrates')).toBe(true)
  })
  test('branches', () => {
    const man = pred('socrates', (s: string) => s.startsWith('p'))
    expect(man('beer')).toBe(false)
    expect(man('socrates')).toBe(true)
    expect(man('platon')).toBe(true)
    const connected = pred([2, 3], [4, 5], [2, 7])
    expect(connected(2, 3)).toBe(true)
    expect(connected(2, 9)).toBe(false)
  })

  test('rules', () => {
    const man = pred('socrates')
    const mortal = pred(x => man(x))
    expect(mortal('socrates')).toBe(true)
  })

  describe('is', () => {
    test('works without anything', () => {
      expect(is(4, 4)).toBe(true)
      expect(is(4, 5)).toBe(false)
    })
  })
  describe('solve', () => {
    const man = pred('socrates')
    const mortal = pred(x => man(x))
    test('decide', () => {
      expect(solve(() => man('socrates'))).toEqual([[]])
      expect(solve(() => man('beer'))).toEqual([])
    })
    test('variables', () => {
      expect(solve(X => is(X, 4))).toEqual([[4]])
    })
  })
})
