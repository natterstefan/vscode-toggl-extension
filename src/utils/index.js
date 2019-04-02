import { workspace, window } from 'vscode' // eslint-disable-line

import { CONSTANTS } from '../constants'

import Poller from './poller'

export const getExtensionSetting = name => {
  return workspace.getConfiguration(CONSTANTS.prefix)[name]
}

export const logger = (level, msg) => {
  const allowedLevels = ['log', 'warn', 'error']
  const logLevel = allowedLevels.includes(level) ? level : 'log'
  const message = msg || 'An error occured. Please try again.'

  console[logLevel](`${CONSTANTS.name}: ${message}`)

  if (logLevel === 'error') {
    window.showErrorMessage(message)
  }
}

export { Poller }
