import Variable from './Variable'
import { ArraySpread } from './unify-array'
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
