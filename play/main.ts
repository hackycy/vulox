import * as vue from 'vue'
import type { Resource } from '../lib/util/types'
import { babelCJSPreprocessor } from '../lib/processor/babel'
import { sucraseCJSPreprocessor } from '../lib/processor/sucrase'
import { load } from '../lib/vulox'
import { PLAY_CODE_CASE1, PLAY_CODE_CASE2, PLAY_CODE_CASE3, PLAY_CODE_CASE4 } from './sfc-case'

function createDom() {
  const dom = document.createElement('div')
  dom.style.borderBottom = '1px dashed #ccc'
  dom.style.paddingBottom = '6px'
  return dom
}

async function bootstrap() {
  const babelOutputDom = document.getElementById('babel-output')!
  const sucraseOutputDom = document.getElementById('sucrase-output')!

  // testcase function define
  async function testSfcCase(code: string, caseId: string) {
    const opt = {
      moduleCache: {
        vue
      },
      appendStyles(id: string, style: string) {
        let styleEl: HTMLStyleElement | null = document.querySelector(`style[scope="${id}"]`)

        if (!styleEl) {
          styleEl = document.createElement('style')
          styleEl.setAttribute('scope', id)
        }

        styleEl.textContent = style
        const ref = document.head.getElementsByTagName('style')[0] || null
        document.head.insertBefore(styleEl, ref)
      }
    }

    // babel
    const babelCaseEl = createDom()
    babelCaseEl.id = `case-${caseId}-babel`
    babelOutputDom.appendChild(babelCaseEl)
    try {
      vue
        .createApp(
          (await load(caseId, {
            ...opt,
            cjsPreprocessor: babelCJSPreprocessor,
            getResource: async (): Promise<Resource> => {
              return {
                type: '.vue',
                content: code
              }
            }
          }))!
        )
        .mount(babelCaseEl)
    } catch (e: any) {
      console.error(e)
      babelCaseEl.innerHTML = `${e.message}`
    }

    // sucrase
    const sucraseCaseEl = createDom()
    sucraseCaseEl.id = `case-${caseId}-sucrase`
    sucraseOutputDom.appendChild(sucraseCaseEl)
    try {
      vue
        .createApp(
          (await load(caseId, {
            ...opt,
            cjsPreprocessor: sucraseCJSPreprocessor,
            getResource: async (): Promise<Resource> => {
              return {
                type: '.vue',
                content: code
              }
            }
          }))!
        )
        .mount(sucraseCaseEl)
    } catch (e: any) {
      console.error(e)
      sucraseCaseEl.innerHTML = `${e.message}`
    }
  }

  await testSfcCase('', 'case0')
  await testSfcCase(PLAY_CODE_CASE1, 'case1')
  await testSfcCase(PLAY_CODE_CASE2, 'case2')
  await testSfcCase(PLAY_CODE_CASE3, 'case3')
  await testSfcCase(PLAY_CODE_CASE4, 'case4')
}

window.onload = bootstrap
