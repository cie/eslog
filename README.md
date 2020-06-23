# eslog

A (very early stage) Prolog system for JavaScript and TypeScript.

```js
const el = new Eslog().assert(
  ['Mary', 'likes', 'food'],
  ['Mary', 'likes', 'wine'],
  ['John', 'likes', 'wine'],
  ['John', 'likes', 'Mary']
)
el.isTrue(['Mary', 'likes', 'food']) // --> true
```

Contrary to Prolog, the basic building blocks of statements are arrays, not function-like structures.
