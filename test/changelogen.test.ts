import { factory, runTasks } from 'release-it/test/util/index.js'
import { describe, expect, it } from 'vitest'

import Plugin from '../src/index'

const namespace = 'changelogen-plugin'
describe('changelogen-plugin', async () => {
  it('should not throw', async () => {
    const options = { [namespace]: {} }
    const plugin = factory(Plugin, { namespace, options })
    expect(async () => {
      await runTasks(plugin)
      // console.log(result)
    }).not.toThrowError()
  })
  // it('should return version', async () => {
  //   const options = { [namespace]: {} }
  //   const plugin = factory(Plugin, { namespace, options })
  //   const result = await runTasks(plugin)
  //   expect(result.version).toBe('1.0.1')
  // })
})
