import type { VOptions } from './types'

export * from './types'

export async function load<T = unknown>(options: VOptions): Promise<T> {
  // eslint-disable-next-line no-console
  console.log(options)

  return null as T
}
