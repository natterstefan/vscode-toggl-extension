import { workspace, window } from 'vscode' // eslint-disable-line

import { CONSTANTS } from '../constants'

import Poller from './poller'

export const getExtensionSetting = name => {
  return workspace.getConfiguration(CONSTANTS.prefix)[name]
}

export const logger = (level, error, msg) => {
  console[level](`${CONSTANTS.name}: ${error || msg}`)

  if (level === 'error' && msg) {
    const message = msg || 'An error occured. Please try again.'
    window.showErrorMessage(message)
  }
}

export { Poller }
