/**
 * inspired by
 * - https://github.com/Unibeautify/vscode/blob/82e360ff73516c213fea0fa6c2740f0cd53d581b/test/extension.test.ts
 */
import { activate } from './extension'

// Defines a Jest test suite to group tests of similar kind together
describe('Extension', () => {
  // Defines a Jest unit test
  it('Activate', () => {
    const context = {
      subscriptions: [],
    }
    activate(context)

    expect(context.subscriptions.length).toBeGreaterThan(0)
  })
})
