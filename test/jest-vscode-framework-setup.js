/**
 * Takes the Visual Studio Code extension API which was exposed on the sandbox's
 * global object and uses it to create a virtual mock. This replaces vscode
 * module imports with the vscode extension instance from the test runner's
 * environment.
 *
 * @see https://github.com/Unibeautify/vscode/blob/61897cd6cd0567db2c8688c3c0b835f9b5c5b446/test/jest-vscode-framework-setup.ts
 */
import nock from 'nock'

jest.mock(
  'vscode',
  () => {
    return {
      ...global.vscode,
      window: {
        ...global.vscode.window,
        // returning a static value works as long as only startEntry uses showInputbox
        showInputBox: jest.fn().mockReturnValue('test entry'),
      },
    }
  },
  { virtual: true },
)

/**
 * mock all request to toggl.com
 *
 * to mock a single request in a test, this would be required
 *
 * ```js
 * nock('https://www.toggl.com')
 * .get('/api/v8/time_entries/start')
 * .reply(200, { data: 1 });
 * ```
 *
 * docs: https://www.npmjs.com/package/nock
 */
nock('https://www.toggl.com')
  .get(() => true)
  .reply(200, {})

nock('https://www.toggl.com')
  .post(() => true)
  .reply(200, {})
