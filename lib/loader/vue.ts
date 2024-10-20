import {
  type CompilerOptions,
  type SFCAsyncStyleCompileOptions,
  type SFCTemplateCompileOptions,
  compileScript,
  compileStyleAsync,
  compileTemplate,
  parse
} from '@vue/compiler-sfc'
import hashId from 'hash-sum'
import type { LoaderOptions, ModuleExport, Preset } from '../types'
import { isJSXLang, isTSLang } from '../utils'

export async function loadVueModule(source: string, filename: string, options: LoaderOptions): Promise<ModuleExport | null | undefined> {
  const component: { [key: string]: any } = {}

  const { descriptor } = parse(source, {
    filename
  })

  const { moduleProvider, cjsProcessor, onResourceLoad, onStyleLoad, vueCompilerOptions } = options

  const id = hashId(filename)
  const scopeId = `data-v-${id}`
  const hasScoped = descriptor.styles.some((s) => s.scoped)

  if (hasScoped) {
    // see https://github.com/vuejs/core/blob/770ea67a9cdbb9f01bd7098b8c63978037d0e3fd/packages/runtime-core/src/component.ts#L192
    // vue-loader: https://github.com/vuejs/vue-loader/blob/65c91108e5ace3a8c00c569f08e9a847be5754f6/src/index.ts#L223
    component.__scopeId = scopeId
  }

  const lang = descriptor.script?.lang || descriptor.scriptSetup?.lang
  const isTs = isTSLang(lang)
  const isJsx = isJSXLang(lang)

  const compileTemplateOptions: SFCTemplateCompileOptions | undefined = descriptor.template
    ? {
        filename,
        isProd: true,
        scoped: hasScoped,
        id,
        slotted: descriptor.slotted,
        ssr: false,
        source: descriptor.template.content,
        compilerOptions: {
          mode: 'module',
          scopeId: hasScoped ? scopeId : undefined,
          delimiters: vueCompilerOptions?.delimiters,
          whitespace: vueCompilerOptions?.whitespace,
          isCustomElement: vueCompilerOptions?.isCustomElement,
          expressionPlugins: [...(isTs ? ['typescript'] : []), ...(isJsx ? ['jsx'] : [])] as CompilerOptions['expressionPlugins']
        },
        preprocessLang: descriptor.template.lang,
        preprocessCustomRequire: (id) => moduleProvider[id]
      }
    : undefined

  // process <script> and <script setup>
  if (descriptor.script || descriptor.scriptSetup) {
    // <script setup> cannot be used with the src attribute.
    if (descriptor.script?.src) {
      descriptor.script.content = await (await onResourceLoad(descriptor.script.src)).content()
    }

    const scriptBlock = compileScript(descriptor, {
      id,
      isProd: true,
      inlineTemplate: false,
      templateOptions: compileTemplateOptions
    })

    if (compileTemplateOptions) {
      compileTemplateOptions.compilerOptions!.bindingMetadata = scriptBlock.bindings
    }

    Object.assign(
      component,
      (
        (await cjsProcessor(scriptBlock.content, filename, options, [
          ...(isTs ? ['typescript'] : []),
          ...(isJsx ? ['jsx'] : [])
        ] as Preset[]))! as any
      ).default
    )
  }

  // process <template>
  if (descriptor.template) {
    if (descriptor.template?.src) {
      descriptor.template.content = await (await onResourceLoad(descriptor.template.src)).content()
    }

    const template = compileTemplate(compileTemplateOptions!)
    Object.assign(component, await cjsProcessor(template.code, filename, options))
  }

  // process <style>
  for (const style of descriptor.styles) {
    if (style.module) {
      throw new Error('<style module> are not supported yet.')
    }

    const raw = style.src ? await (await onResourceLoad(style.src)).content() : style.content

    const styleResult = await compileStyleAsync({
      source: raw,
      filename,
      id,
      scoped: style.scoped,
      modules: !!style.module,
      trim: true,
      preprocessLang: style.lang as SFCAsyncStyleCompileOptions['preprocessLang'],
      preprocessCustomRequire: (id) => moduleProvider[id]
    })

    if (styleResult.errors.length > 0) {
      throw styleResult.errors[0]
    }

    if (onStyleLoad) {
      onStyleLoad(scopeId, styleResult.code)
    }
  }

  return component
}
