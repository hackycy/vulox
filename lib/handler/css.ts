import hashId from 'hash-sum'
import type { LoaderOptions } from '../types'

export async function handleCSSModule(_type: string, source: string, filename: string, options: LoaderOptions) {
  const styleId = hashId(filename)
  const { appendStyles } = options

  if (appendStyles) {
    appendStyles(styleId, source)
  }

  return {
    id: styleId
  }
}
