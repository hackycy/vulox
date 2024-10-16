// import type { ESOptions, Module } from '../types'

export const __IMPORT_FUNCTION__ = '__xparser_dyn_import__'

// export function createCJSModule(source: string, _filename: string, opt: ESOptions): Module {
//   const { modules } = opt

//   const require = function (id: string) {
//     if (id in modules) {
//       return modules[id]
//     }

//     throw new Error(`Require module ${id} not found.`)
//   }

//   const module = {
//     exports: {}
//   }

//   // see https://github.com/nodejs/node/blob/82dab76d63e6f3592e15e49d7dba2367044d4869/lib/internal/modules/cjs/loader.js#L329
//   const fn = new Function('exports', 'require', 'module', source)
//   fn.call(module.exports, module.exports, require, module)

//   return module
// }

export function interopRequireDefault(obj: any): any {
  return obj && obj.__esModule ? obj : { default: obj }
}

export function testTs(filename: string | undefined | null) {
  return !!(filename && /(?:\.|\b)tsx?$/.test(filename))
}

export function testJsx(filename: string | undefined | null) {
  return !!(filename && /(?:\.|\b)[jt]sx$/.test(filename))
}
