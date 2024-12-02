/**
 * @internal
 */
export function throwNotDefined(details: string): never {
  throw new ReferenceError(`${details} is not defined`)
}
