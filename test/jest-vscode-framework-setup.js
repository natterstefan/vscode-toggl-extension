/**
 * Takes the Visual Studio Code extension API which was exposed on the sandbox's
 * global object and uses it to create a virtual mock. This replaces vscode
 * module imports with the vscode extension instance from the test runner's
 * environment.
 *
 * @see https://github.com/Unibeautify/vscode/blob/61897cd6cd0567db2c8688c3c0b835f9b5c5b446/test/jest-vscode-framework-setup.ts
 *
 * Furthermore some modules and vscode functions are mocked here for several
 * test cases.
 */
import nock from 'nock'

global.mockEventListener = jest.fn()
global.mockInfoListener = jest.fn()
global.mockGetConfigurationListener = jest.fn()

jest.mock(
  'vscode',
  () => {
    return {
      ...global.vscode,
      commands: {
        ...global.vscode.commands,
        executeCommand: jest.fn((c, ...other) => {
          // make info about executed command name available in tests
          global.mockEventListener(c)

          // mock, or it will open browser in the tests
          if (c === 'vscode.open') {
            return true
          }

          return global.vscode.commands.executeCommand(c, ...other)
        }),
      },
      workspace: {
        ...global.vscode.workspace,
        getConfiguration: jest.fn(c => {
          global.mockGetConfigurationListener(c)

          // return a mocked toggl config (see available options in package.json)
          if (c === 'toggl') {
            return {
              apiKey: '87654321',
              defaultProjectId: '12345678',
              pollingTimeout: 60,
            }
          }

          return global.vscode.workspace.getConfiguration(c)
        }),
      },
      window: {
        ...global.vscode.window,
        // returning a static value works as long as only startEntry uses showInputbox
        showInputBox: jest.fn().mockResolvedValue('test entry'),
        showQuickPick: jest.fn().mockResolvedValue('existing test entry'),
        showInformationMessage: jest.fn(m => {
          global.mockInfoListener(m)
          global.vscode.window.showInformationMessage(m)
        }),
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
const mockedTimeEntry = {
  id: 1122334455,
  guid: '0e45085e5e8947cdb185572bb8e479de',
  wid: 123456,
  pid: 12345678,
  billable: false,
  start: '2019-03-03T20:45:25+00:00',
  duration: -1552596325,
  description: 'test entry',
  duronly: false,
  at: '2019-03-03T20:45:25+00:00',
  uid: 1234567,
}

nock('https://www.toggl.com')
  .persist() // between tests
  .get('/api/v8/time_entries/current')
  .reply(200, { data: mockedTimeEntry })

nock('https://www.toggl.com')
  .persist() // between tests
  .get('/api/v8/time_entries')
  .reply(200, [])

nock('https://www.toggl.com')
  .persist() // between tests
  .post(() => true)
  .reply(200, { data: {} })

nock('https://www.toggl.com')
  .persist() // between tests
  .put(/api\/v8\/time_entries\/.*\/stop/)
  .reply(200, { data: [mockedTimeEntry] })
