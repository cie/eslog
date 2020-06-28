import Debug from 'debug'

interface Debugger {
  (formatter: string, ...args: any[]): void
  enabled: boolean
  begin(formatter: string, ...args: any[]): void
  end(formatter?: string, ...args: any[]): void
}

const d = Debug('eslog')
const debug = function debug (formatter: string, ...args: any[]) {
  d(' '.repeat(indent) + formatter, ...args)
} as Debugger
Object.defineProperty(debug, 'enabled', {
  get () {
    return d.enabled
  }
})
let indent = 0
debug.begin = (formatter: string, ...args: any[]) => {
  debug(formatter, ...args)
  ++indent
}
debug.end = (formatter = '*', ...args: any[]) => {
  --indent
  debug(formatter, ...args)
}

export default debug
