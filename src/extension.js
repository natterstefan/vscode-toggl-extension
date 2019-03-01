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
 */
import Toggl from './toggl'
import StatusBar from './statusbar'

const vscode = require('vscode') // eslint-disable-line
const initCommands = require('./commands')

/**
 * TODO: do not activate, but show warning, wenn required config values are not
 * set (eg. apiKey)
 */

function activate(context) {
  // FYI Use the console to output diagnostic information (console.log) and errors (console.error)

  // initialise features
  initCommands(context) // TODO: create class

  const statusBar = new StatusBar(context)
  statusBar.initStatusbar()

  // TODO: create actual command, instead of PoC implementation here
  const apiClient = new Toggl(context)
  apiClient
    .getCurrentTimeEntry()
    .then(data => {
      console.log(data) // eslint-disable-line

      // TODO: think about i18n
      statusBar.updateStatus(
        `You are currently working on: ${data.description}`,
      )
    })
    .catch(err => console.log(err)) // eslint-disable-line
}

exports.activate = activate
