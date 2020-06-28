export class DefaultsMap<K, V> extends Map<K, V> {
  factory: () => V
  constructor (factory: () => V) {
    super()
    this.factory = factory
  }
  get (k: K): V {
    if (!this.has(k)) {
      const v = this.factory()
      this.set(k, v)
      return v
    } else {
      return super.get(k)!
    }
  }
}
