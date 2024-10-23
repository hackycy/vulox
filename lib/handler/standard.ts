import type { LoaderOptions, Preset } from '../util/types'
import { isJSXLang, isTSLang } from '../util/utils'

export async function handleStandardModule(type: string, source: string, filename: string, options: LoaderOptions) {
  const { cjsPreprocessor } = options

  const presets: Preset[] = []
  if (isTSLang(type)) {
    presets.push('typescript')
  }

  if (isJSXLang(type)) {
    presets.push('jsx')
  }

  return await cjsPreprocessor(source, filename, options, presets)
}
