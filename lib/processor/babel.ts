import { type PluginItem, transformFromAstAsync } from '@babel/core'
import { parse } from '@babel/parser'
// eslint-disable-next-line ts/ban-ts-comment
// @ts-ignore
import babelPluginTransformDynamicImport from '@babel/plugin-transform-dynamic-import'
// eslint-disable-next-line ts/ban-ts-comment
// @ts-ignore
import babelPluginTransformModulesCommonjs from '@babel/plugin-transform-modules-commonjs'
// eslint-disable-next-line ts/ban-ts-comment
// @ts-ignore
import babelPluginTransformTypescript from '@babel/plugin-transform-typescript'
import babelPluginVueJsx from '@vue/babel-plugin-jsx'

import type { LoaderOptions, ModuleExport, Preset } from '../util/types'
import { createCJSModule } from '../util/utils'

export async function babelCJSPreprocessor(
  source: string,
  filename: string,
  options: LoaderOptions,
  presets?: Preset[]
): Promise<ModuleExport> {
  const ast = parse(source, {
    sourceType: 'module',
    sourceFilename: filename,
    plugins: presets
  })

  const transformed = await transformFromAstAsync(ast, source, {
    sourceMaps: false,
    filename,
    plugins: [
      babelPluginTransformDynamicImport,
      babelPluginTransformModulesCommonjs,
      ...(presets && presets.includes('typescript') ? [babelPluginTransformTypescript] : []),
      ...(presets && presets.includes('jsx') ? [babelPluginVueJsx] : [])
    ] as PluginItem[],
    babelrc: false,
    configFile: false,
    highlightCode: false,
    compact: false,
    comments: false,
    retainLines: false,
    minified: false,
    sourceType: 'module'
  })

  return createCJSModule(transformed!.code!, options)
}
