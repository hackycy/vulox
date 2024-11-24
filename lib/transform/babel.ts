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

import type { Code, TransformOptions } from '../util/types'

export async function transform(source: string, opt: TransformOptions): Promise<Code> {
  const ast = parse(source, {
    sourceType: 'module',
    sourceFilename: opt.filename,
    plugins: opt.presets
  })

  const transformed = await transformFromAstAsync(ast, source, {
    filename: opt.filename,
    plugins: [
      babelPluginTransformDynamicImport,
      babelPluginTransformModulesCommonjs,
      ...(opt.presets && opt.presets.includes('typescript') ? [babelPluginTransformTypescript] : []),
      ...(opt.presets && opt.presets.includes('jsx') ? [babelPluginVueJsx] : [])
    ] as PluginItem[],
    sourceMaps: false,
    babelrc: false,
    configFile: false,
    highlightCode: false,
    compact: false,
    comments: false,
    retainLines: false,
    minified: false,
    sourceType: 'module'
  })

  return transformed?.code
}
