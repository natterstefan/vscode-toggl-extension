import CONSTANTS from '../constants'

import { workspace } from 'vscode' // eslint-disable-line

export const createElementName = name => `${CONSTANTS.prefix}.${name}`

export const getExtensionSetting = name =>
  workspace.getConfiguration(CONSTANTS.prefix)[name]
