import { type NodePath, type PluginItem, types as t, transformFromAstAsync, traverse } from '@babel/core'
import { parse } from '@babel/parser'
// eslint-disable-next-line ts/ban-ts-comment
// @ts-ignore
import babelPluginTransformModulesCommonjs from '@babel/plugin-transform-modules-commonjs'
// eslint-disable-next-line ts/ban-ts-comment
// @ts-ignore
import babelPluginTransformTypescript from '@babel/plugin-transform-typescript'
import babelPluginVueJsx from '@vue/babel-plugin-jsx'

import type { LoaderOptions, ModuleExport, Preset } from '../types'
import { createCJSModule } from '../utils'

export const __IMPORT_FUNCTION__ = '__vulox_dyn_import__'

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

  renameDynamicImport(ast)

  const transformed = await transformFromAstAsync(ast, source, {
    sourceMaps: false,
    filename,
    plugins: [
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

/**
 * @private
 */
function renameDynamicImport(ast: t.File): void {
  traverse(ast, {
    CallExpression(path: NodePath<t.CallExpression>) {
      if (t.isImport(path.node.callee)) {
        path.replaceWith(t.callExpression(t.identifier(__IMPORT_FUNCTION__), path.node.arguments))
      }
    }
  })
}
