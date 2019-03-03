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
 */
import vscode from 'vscode' // eslint-disable-line
import Toggl from './toggl'
import StatusBar from './statusbar'
import Commands from './commands'
import CONSTANTS from './constants'

/**
 * TODO: do not activate, but show warning, wenn required config values are not
 * set (eg. apiKey)
 */

export function activate(context) {
  // initialise features
  const commands = new Commands(context)
  commands.initCommands()

  const statusBar = new StatusBar(context)
  statusBar.initStatusbar()

  // TODO: create actual command, instead of PoC implementation here
  const apiClient = new Toggl(context)
  apiClient
    .getCurrentTimeEntry()
    .then(data => {
      if (!data) {
        statusBar.updateStatus(`#relaxMode`)
        return
      }

      console.log(data) // eslint-disable-line
      // TODO: think about i18n
      statusBar.updateStatus(
        `You are currently working on: ${data.description}`,
      )
    })
    .catch(err => console.log(err)) // eslint-disable-line

  console.log(`${CONSTANTS.name} client is activated now...`) // eslint-disable-line
}

// eslint disable-next-line no-empty
export function deactivate() {}
