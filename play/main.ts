// import * as vue from 'vue'
// import { parseSFC as sucraseParseSFC } from '../lib/parser.sucrase'
// import { parseSFC as babelParseSFC } from '../lib/parser.babel'
// import type { ParseSFCOptions } from '../lib/types'
// import { PLAY_CODE_CASE1, PLAY_CODE_CASE2, PLAY_CODE_CASE3, PLAY_CODE_CASE4 } from './sfc-case'

// function createDom() {
//   const dom = document.createElement('div')
//   dom.style.borderBottom = '1px dashed #ccc'
//   dom.style.paddingBottom = '6px'
//   return dom
// }

// async function bootstrap() {
//   const babelOutputDom = document.getElementById('babel-output')!
//   const sucraseOutputDom = document.getElementById('sucrase-output')!

//   // testcase function define
//   async function testSfcCase(code: string, caseId: string) {
//     const opt: ParseSFCOptions = {
//       modules: {
//         vue
//       },
//       getResource: async (path) => {
//         return path
//       },
//       linkStyleSheet(style: string, scopeId?: string) {
//         let styleEl: HTMLStyleElement | null = null
//         if (scopeId) {
//           styleEl = document.querySelector(`style[scope="${scopeId}"]`)
//         }

//         if (!styleEl) {
//           styleEl = document.createElement('style')
//           if (scopeId) {
//             styleEl.setAttribute('scope', scopeId)
//           }
//         }

//         styleEl.textContent = style
//         const ref = document.head.getElementsByTagName('style')[0] || null
//         document.head.insertBefore(styleEl, ref)
//       }
//     }

//     // babel
//     const babelCaseEl = createDom()
//     babelCaseEl.id = `case-${caseId}-babel`
//     babelOutputDom.appendChild(babelCaseEl)
//     try {
//       const babelComp = await babelParseSFC(code, `case-${caseId}.vue`, opt)
//       vue.createApp(babelComp!).mount(babelCaseEl)
//     } catch (e: any) {
//       console.error(e)
//       babelCaseEl.innerHTML = `${e.message}`
//     }

//     // sucrase
//     const sucraseCaseEl = createDom()
//     sucraseCaseEl.id = `case-${caseId}-sucrase`
//     sucraseOutputDom.appendChild(sucraseCaseEl)
//     try {
//       const sucraseComp = await sucraseParseSFC(code, `case-${caseId}.vue`, opt)
//       vue.createApp(sucraseComp!).mount(sucraseCaseEl)
//     } catch (e: any) {
//       console.error(e)
//       sucraseCaseEl.innerHTML = `${e.message}`
//     }
//   }

//   await testSfcCase('', 'case0')
//   await testSfcCase(PLAY_CODE_CASE1, 'case1')
//   await testSfcCase(PLAY_CODE_CASE2, 'case2')
//   await testSfcCase(PLAY_CODE_CASE3, 'case3')
//   await testSfcCase(PLAY_CODE_CASE4, 'case4')
// }

window.onload = () => {}
