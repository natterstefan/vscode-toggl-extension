/**
 * inspired by
 * - https://github.com/7eggs/node-toggl-api/blob/80d6796422aa71b95fbd5d3fc371c0a203cd9d78/lib/errors.js
 *
 * use error.toJSON() to get all details of an error
 *
 * TODO:
 * - properly implement and use everywhere (eg. in all catch cases)
 */
import createCustomError from 'custom-error-generator'

import CONSTANT from '../constants'

export const SettingsError = createCustomError(
  'SettingsError',
  null,
  function createSettingsError(settingKey) {
    let settingName = ''

    switch (settingKey) {
      case 'apiKey':
        settingName = 'API token'
        break

      default:
        settingName = 'the extension settings'
        break
    }

    this.text = `${
      CONSTANT.name
    } - SettingsError: Please configure ${settingName}, before using the extension. Once you have changed it, reload the workspace and window.`
  },
)

export default { SettingsError }
