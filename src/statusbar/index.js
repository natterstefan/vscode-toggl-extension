/**
 * Originally inspired by
 * - https://github.com/Microsoft/vscode-extension-samples/tree/8ea86205551f2b0c5cad2712c2c4a7c1b6e2a4cd/statusbar-sample
 *
 * Docs
 * - list of icons https://gist.github.com/reyawn/b23ded4ddbfe8aacf77f0581f81000a0
 */
import { commands, StatusBarAlignment, window } from 'vscode' // eslint-disable-line
import { createElementName } from '../utils'
import CONSTANTS from '../constants'

class StatusBar {
  constructor(context) {
    this.context = context
    this.text = ''

    // bindings
    this.showTogglItemInfo = this.showTogglItemInfo.bind(this)
  }

  init() {
    // register internal command
    const commandId = createElementName('udpateStatusbar')
    const commandHandler = this.showTogglItemInfo

    // activate the command
    const command = commands.registerCommand(commandId, commandHandler)
    this.context.subscriptions.push(command)

    // create the StatusBar with command onClick
    this.status = window.createStatusBarItem(StatusBarAlignment.Right, 100)
    this.status.command = createElementName('openToggl')
    this.status.tooltip = `${CONSTANTS.name}: Click to open toggl.com!`
    this.context.subscriptions.push(this.status)

    // initialise empty bar
    this.updateStatus()
  }

  updateStatus(text) {
    this.text = text || '-'
    this.status.text = ['$(watch) Toggl:', this.text].filter(i => !!i).join(' ') // only statusbar is capable of displaying emojis
    this.status.show()
  }

  showTogglItemInfo(togglItem) {
    if (!togglItem) {
      this.updateStatus()
      return
    }

    this.updateStatus(`${togglItem.description} (${togglItem.durationText})`)
  }
}

export default StatusBar
