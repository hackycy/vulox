import type { VOptions } from './types'

export * from './types'

export async function load<T = unknown>(options: VOptions): Promise<T> {
  const { moduleCache } = options

  // eslint-disable-next-line no-console
  console.log(Object.keys(moduleCache))

  return null as T
}
