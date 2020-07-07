import Variable from './Variable'
import { ArraySpread } from './unify-array'
import { StringPattern } from './string-pattern'
export type Term =
  | symbol
  | string
  | number
  | null
  | undefined
  | boolean
  | Term[]
  | Variable
  | ArraySpread
  | StringPattern
