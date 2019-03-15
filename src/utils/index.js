import { workspace } from 'vscode' // eslint-disable-line

import { CONSTANTS } from '../constants'

import Poller from './poller'

export const getExtensionSetting = name => {
  return workspace.getConfiguration(CONSTANTS.prefix)[name]
}

export { Poller }
