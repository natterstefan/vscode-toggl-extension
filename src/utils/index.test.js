import { CONSTANTS } from '../constants'

import { getExtensionSetting, logger } from '.'

describe('utils/getExtensionSetting', () => {
  beforeEach(() => {
    global.mockGetConfigurationListener.mockReset()
  })
  it('returns setting from the current vs code workspace', () => {
    const result = getExtensionSetting('apiKey')
    expect(global.mockGetConfigurationListener).toHaveBeenCalledTimes(1)
    expect(global.mockGetConfigurationListener).toHaveBeenCalledWith('toggl')

    // see test/jest-vscode-framework-setup.js
    expect(result).toStrictEqual('87654321')
  })
})

describe('utils/logger', () => {
  let consoleBackup

  beforeAll(() => {
    consoleBackup = console
    console.log = jest.fn()
    console.warn = jest.fn()
    console.error = jest.fn()
  })

  beforeEach(() => {
    console.log.mockReset()
    console.warn.mockReset()
    console.error.mockReset()

    global.mockErrorListener.mockReset()
  })

  afterAll(() => {
    // eslint-disable-next-line
    console = consoleBackup
  })

  it('logs message for the allowed levels', () => {
    const levels = ['log', 'warn', 'error']
    const msg = 'test'

    levels.forEach(level => {
      logger(level, msg)
      expect(console[level]).toHaveBeenCalledTimes(1)
      expect(console[level]).toHaveBeenCalledWith(`${CONSTANTS.name}: ${msg}`)
    })
  })

  it('logs message with loglevel "log" for any unknown log level', () => {
    const msg = 'test'

    logger('unknown', msg)

    expect(console.log).toHaveBeenCalledTimes(1)
    expect(console.log).toHaveBeenCalledWith(`${CONSTANTS.name}: ${msg}`)
  })

  it('also shows error in the vs code window', () => {
    const level = 'error'
    const msg = 'test'

    logger(level, msg)
    expect(console[level]).toHaveBeenCalledTimes(1)
    expect(console[level]).toHaveBeenCalledWith(`${CONSTANTS.name}: ${msg}`)
    expect(global.mockErrorListener).toHaveBeenLastCalledWith(msg)
  })

  it('also shows error in the vs code window with a default error text, when none is given', () => {
    const msgFallback = 'An error occured. Please try again.'
    const level = 'error'

    logger(level)
    expect(console[level]).toHaveBeenCalledTimes(1)
    expect(console[level]).toHaveBeenCalledWith(
      `${CONSTANTS.name}: ${msgFallback}`,
    )
    expect(global.mockErrorListener).toHaveBeenLastCalledWith(msgFallback)
  })
})
