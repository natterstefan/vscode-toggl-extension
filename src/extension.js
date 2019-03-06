/**
 * Docs
 * - https://code.visualstudio.com/docs/extensions/overview
 *
 * Examples
 * - https://code.visualstudio.com/docs/extensions/example-hello-world
 * - https://github.com/Microsoft/vscode-extension-samples
 *
 * FYI Use the console to output diagnostic information (console.log) and errors (console.error)
 *
 * TODO:
 * - i18n
 * - logger flag (info, warn, error)
 * - do not execute commands (start fetching), but show warning, when required
 *   config values are not set (eg. apiKey)
 */
import { commands as commandsHandler, window } from 'vscode' // eslint-disable-line

import CONSTANTS from './constants'
import Toggl from './toggl'
import StatusBar from './statusbar'
import Commands from './commands'
import { createElementName } from './utils'

export function activate(context) {
  try {
    console.log(`${CONSTANTS.name} is activating...`)

    // set up available commands and the statusbar
    const togglClient = new Toggl(context)
    const statusBar = new StatusBar(context)
    const commands = new Commands(context, togglClient, statusBar)

    // init all features
    commands.initCommands()
    statusBar.initStatusbar()

    // start polling once the extension is activated
    const commandId = createElementName('startPolling')
    commandsHandler.executeCommand(commandId) // promise

    // log successfull start
    console.log(`${CONSTANTS.name} is activated now!`)
  } catch (error) {
    // TODO: handle all catched errors during activation _and_ execution here
    window.showErrorMessage(error.text)
    console.error(error)
  }
}

// eslint disable-next-line no-empty
export function deactivate() {}
