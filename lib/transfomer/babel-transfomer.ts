import { type NodePath, type PluginItem, types as t, transformFromAstAsync, traverse } from '@babel/core'
import { type ParserPlugin, parse } from '@babel/parser'
// eslint-disable-next-line ts/ban-ts-comment
// @ts-ignore
import babelPluginTransformModulesCommonjs from '@babel/plugin-transform-modules-commonjs'
// eslint-disable-next-line ts/ban-ts-comment
// @ts-ignore
import babelPluginTransformTypescript from '@babel/plugin-transform-typescript'
import babelPluginVueJsx from '@vue/babel-plugin-jsx'
import type { ModuleExport } from '../types'
import type AbsTransfomer from './abstract-transfomer'

export const __IMPORT_FUNCTION__ = '__xparser_dyn_import__'

class BabelTransformer implements AbsTransfomer {
  async process(source: string, filename: string): Promise<ModuleExport> {
    const parserPlugins: ParserPlugin[] = []
    const transformPlugins: PluginItem[] = [babelPluginTransformModulesCommonjs]

    parserPlugins.push('typescript')
    transformPlugins.push(babelPluginTransformTypescript)

    parserPlugins.push('jsx')

    // vue sfc
    if (filename.endsWith('.vue')) {
      transformPlugins.push(babelPluginVueJsx)
    }

    const ast = parse(source, {
      sourceType: 'module',
      sourceFilename: filename,
      plugins: parserPlugins
    })

    this.renameDynamicImport(ast)

    const transformed = await transformFromAstAsync(ast, source, {
      sourceMaps: false,
      filename,
      plugins: transformPlugins,
      babelrc: false,
      configFile: false,
      highlightCode: false,
      compact: false,
      comments: false,
      retainLines: false,
      minified: false,
      sourceType: 'module'
    })
    console.log(transformed)

    // return transformed!.code
    return {}
  }

  /**
   * import is a reserved keyword, then rename
   *
   * @example
   * import(path) => __xparser_dyn_import__(path)
   */
  private renameDynamicImport(ast: t.File): void {
    traverse(ast, {
      CallExpression(path: NodePath<t.CallExpression>) {
        if (t.isImport(path.node.callee)) {
          path.replaceWith(t.callExpression(t.identifier(__IMPORT_FUNCTION__), path.node.arguments))
        }
      }
    })
  }
}

export const transformer = new BabelTransformer()
