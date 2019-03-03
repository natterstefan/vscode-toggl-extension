/**
 * inspired by
 * - https://github.com/Unibeautify/vscode/blob/82e360ff73516c213fea0fa6c2740f0cd53d581b/test/extension.test.ts
 *
 * NOTE - Activation Events
 *
 * - When setting `"activationEvents": ["*"],` in the package.json, I got the
 *   following error: `command 'vscodetoggl.sayHello' already exists`.
 *   I was only able to remove it by setting `"--extensionDevelopmentPath=${workspaceRoot}/dist",``
 *   in the `launch.json`. But then I still get a weird error:
 *   ```
 *    Could not identify extension for 'vscode' require call from
 *    /Users/(...)/vs-code-toggl-extension/dist-test/jest-vscode-environment.js.
 *    These are the extension path mappings: ..."
 *   ```
 *   The test still works, but I do not know how to handle this warning/error.
 *
 * - when setting the Activation Events to `"activationEvents": [onCommand:vscodetoggl.sayHello"],``
 *   (or any other event name) it works fine, _but_ the extension is then not
 *   activated on startup.
 */
import { activate } from './extension'

describe('Extension', () => {
  it('can be activated', () => {
    const context = {
      subscriptions: [],
    }

    activate(context)
    expect(context.subscriptions.length).toBeGreaterThan(0)
  })
})
