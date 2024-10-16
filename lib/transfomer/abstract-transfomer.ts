import type { ModuleExport } from '../types'

export default abstract class AbsTransfomer {
  /**
   * transform the source to cjs module export
   */
  abstract process(source: string, filename: string): Promise<ModuleExport>
}
