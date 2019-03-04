/**
 * Docs
 * - https://code.visualstudio.com/docs/extensions/overview
 *
 * Examples
 * - https://code.visualstudio.com/docs/extensions/example-hello-world
 * - https://github.com/Microsoft/vscode-extension-samples
 *
 * Publishing
 * - https://code.visualstudio.com/docs/extensions/publish-extension
 *
 * FYI Use the console to output diagnostic information (console.log) and errors (console.error)
 *
 * TODO:
 * - i18n
 * - logger flag (info, warn, error)
 * - do not execute commands (start fetching), but show warning, when required
 *   config values are not set (eg. apiKey)
 */
import { window } from 'vscode' // eslint-disable-line

import CONSTANTS from './constants'
import Toggl from './toggl'
import StatusBar from './statusbar'
import Commands from './commands'

export function activate(context) {
  try {
    console.log(`${CONSTANTS.name} client is going to be activated...`) // eslint-disable-line

    // set up available commands and the statusbar
    const apiClient = new Toggl(context)
    const statusBar = new StatusBar(context)
    const commands = new Commands(context, apiClient, statusBar)

    // init all features
    commands.initCommands()
    statusBar.initStatusbar()

    // start fetching current time entry and display it in statusbar
    apiClient.pollCurrentTimeEntry((err, data) => {
      if (err) {
        // ATTENTION: currently we do not restart fetching!
        console.error(err)
        return
      }

      statusBar.showCurrentTimeFromTogglItem(data)
    })

    console.log(`${CONSTANTS.name} client is activated now...`) // eslint-disable-line
  } catch (error) {
    // handle all catched errors during activation here
    console.error(error)
    window.showErrorMessage(error.text)
  }
}

// eslint disable-next-line no-empty
export function deactivate() {}
