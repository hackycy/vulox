// import {
//   type CompilerOptions,
//   type SFCAsyncStyleCompileOptions,
//   type SFCTemplateCompileOptions,
//   compileScript,
//   compileStyleAsync,
//   compileTemplate,
//   parse
// } from '@vue/compiler-sfc'
// import hashId from 'hash-sum'
// import type { CJSTransformer, ModuleExport, ParseSFCOptions } from '../types'
// import { createCJSModule, interopRequireDefault } from './commonjs'
// import { testJsx, testTs } from './is'

// export async function compileSFC(
//   source: string,
//   filename: string,
//   options: ParseSFCOptions,
//   transformer: CJSTransformer
// ): Promise<ModuleExport> {
//   if (!filename.endsWith('.vue')) {
//     throw new Error('Only SFC files are supported.')
//   }

//   const { getResource, modules, delimiters, whitespace, isCustomElement, linkStyleSheet } = options

//   // component object
//   const component: { [key: string]: any } = {}

//   const { descriptor, errors } = parse(source, {
//     filename
//   })

//   if (errors.length > 0) {
//     throw errors[0]
//   }

//   const id = hashId(filename)
//   const scopeId = `data-v-${id}`
//   const hasScoped = descriptor.styles.some((s) => s.scoped)
//   if (hasScoped) {
//     // see https://github.com/vuejs/core/blob/770ea67a9cdbb9f01bd7098b8c63978037d0e3fd/packages/runtime-core/src/component.ts#L192
//     // vue-loader: https://github.com/vuejs/vue-loader/blob/65c91108e5ace3a8c00c569f08e9a847be5754f6/src/index.ts#L223
//     component.__scopeId = scopeId
//   }

//   // script lang validation
//   const lang = descriptor.script?.lang || descriptor.scriptSetup?.lang
//   const isTs = testTs(lang)
//   const isJsx = testJsx(lang)

//   if (lang && lang !== 'js' && !isTs && !isJsx) {
//     throw new Error(`Unsupported script lang: ${lang}`)
//   }

//   const expressionPlugins: CompilerOptions['expressionPlugins'] = []
//   if (isJsx) {
//     expressionPlugins.push('jsx')
//   }
//   if (isTs) {
//     expressionPlugins.push('typescript')
//   }

//   const compileTemplateOptions: SFCTemplateCompileOptions | undefined = descriptor.template
//     ? {
//         filename,
//         isProd: true,
//         scoped: hasScoped,
//         id,
//         slotted: descriptor.slotted,
//         ssr: false,
//         source: descriptor.template.content,
//         compilerOptions: {
//           mode: 'module',
//           scopeId: hasScoped ? scopeId : undefined,
//           delimiters,
//           whitespace,
//           isCustomElement,
//           expressionPlugins
//         },
//         preprocessLang: descriptor.template.lang,
//         preprocessCustomRequire: (id) => modules[id]
//       }
//     : undefined

//   // process <script> and <script setup>
//   if (descriptor.script || descriptor.scriptSetup) {
//     // <script setup> cannot be used with the src attribute.
//     if (descriptor.script?.src) {
//       descriptor.script.content = await getResource(descriptor.script.src, filename)
//     }

//     const scriptBlock = compileScript(descriptor, {
//       id,
//       isProd: true,
//       inlineTemplate: false,
//       templateOptions: compileTemplateOptions
//     })

//     if (compileTemplateOptions) {
//       compileTemplateOptions.compilerOptions!.bindingMetadata = scriptBlock.bindings
//     }

//     const code = await transformer(scriptBlock.content, filename, {
//       jsx: isJsx,
//       ts: isTs
//     })
//     Object.assign(
//       component,
//       interopRequireDefault(
//         createCJSModule(code!, filename, {
//           modules,
//           getResource
//         }).exports
//       ).default
//     )
//   }

//   // process <template>
//   if (descriptor.template) {
//     if (descriptor.template?.src) {
//       descriptor.template.content = await getResource(descriptor.template.src, filename)
//     }

//     const template = compileTemplate(compileTemplateOptions!)

//     const code = await transformer(template.code, filename)
//     Object.assign(
//       component,
//       createCJSModule(code!, filename, {
//         modules,
//         getResource
//       }).exports
//     )
//   }

//   // process <style>
//   for (const style of descriptor.styles) {
//     if (style.module) {
//       throw new Error('<style module> are not supported yet.')
//     }

//     const raw = style.src ? await getResource(style.src, filename) : style.content

//     const styleResult = await compileStyleAsync({
//       source: raw,
//       filename,
//       id,
//       scoped: style.scoped,
//       modules: !!style.module,
//       trim: true,
//       preprocessLang: style.lang as SFCAsyncStyleCompileOptions['preprocessLang'],
//       preprocessCustomRequire: (id) => modules[id]
//     })

//     if (styleResult.errors.length > 0) {
//       throw styleResult.errors[0]
//     }

//     if (linkStyleSheet) {
//       linkStyleSheet(styleResult.code, style.scoped ? scopeId : undefined)
//     }
//   }

//   return component
// }
