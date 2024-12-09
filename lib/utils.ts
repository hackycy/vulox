import hashsum from 'hash-sum'

/**
 * @internal
 */
export function throwNotDefined(details: string): never {
  throw new ReferenceError(`${details} is not defined`)
}

/**
 * @internal
 */
export function interopRequireDefault(obj: any): any {
  return obj && obj.__esModule ? obj : { default: obj }
}

/**
 * @internal
 */
export function hashId(value: any) {
  return hashsum(value)
}

export function isString(value: any): value is string {
  return typeof value === 'string'
}
