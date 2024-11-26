// eslint-disable-next-line ts/no-unsafe-function-type
export const isFunction = (val: unknown): val is Function => typeof val === 'function'

export function isTSLang(lang: string | null | undefined) {
  return !!(lang && /(?:\.|\b)tsx?$/.test(lang))
}

export function isJSXLang(lang: string | null | undefined) {
  return !!(lang && /(?:\.|\b)[jt]sx$/.test(lang))
}
