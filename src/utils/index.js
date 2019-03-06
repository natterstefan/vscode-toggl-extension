import { workspace } from 'vscode' // eslint-disable-line

import CONSTANTS from '../constants'

import Poller from './poller'

export const createElementName = name => `${CONSTANTS.prefix}.${name}`

export const getExtensionSetting = name =>
  workspace.getConfiguration(CONSTANTS.prefix)[name]

export { Poller }
