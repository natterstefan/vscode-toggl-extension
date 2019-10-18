/**
 * Originally inspired by
 * - https://github.com/Microsoft/vscode-extension-samples/tree/8ea86205551f2b0c5cad2712c2c4a7c1b6e2a4cd/statusbar-sample
 *
 * Docs
 * - list of icons https://gist.github.com/reyawn/b23ded4ddbfe8aacf77f0581f81000a0
 */
import { commands, StatusBarAlignment, window } from 'vscode' // eslint-disable-line
import ellipsize from 'ellipsize'

import { getExtensionSetting, logger } from '../utils'
import { CONSTANTS, EVENTS } from '../constants'

class StatusBar {
  constructor(context) {
    this.context = context
    this.text = ''

    // bindings
    this.showTogglItemInfo = this.showTogglItemInfo.bind(this)
  }

  init() {
    // register internal commands
    const statusBarCommands = [
      {
        commandId: EVENTS.updateStatusBar,
        commandHandler: this.showTogglItemInfo,
      },
      {
        commandId: EVENTS.clickStatusBar,
        commandHandler: this.onClick,
      },
    ]

    // activate the commands
    statusBarCommands.forEach(({ commandId, commandHandler }) => {
      const command = commands.registerCommand(commandId, commandHandler)
      this.context.subscriptions.push(command)
    })

    // create the StatusBar with command onClick
    this.status = window.createStatusBarItem(StatusBarAlignment.Right, 100)
    this.status.command = EVENTS.clickStatusBar
    this.status.tooltip = `${CONSTANTS.name}: Click to open toggl.com!`

    this.context.subscriptions.push(this.status)

    // initialise empty bar
    this.updateStatus()
  }

  onClick() {
    // it is possible to customize the command executed when clicking the statusbar
    const command = getExtensionSetting('statusBarCommand') || EVENTS.openToggl
    try {
      commands.executeCommand(command)
    } catch (error) {
      logger('error', error)
    }
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

    const maxChars = getExtensionSetting('maxChars') || 50
    const shortText = ellipsize(togglItem.description, maxChars)
    this.updateStatus(`${shortText} (${togglItem.durationText})`)
  }
}

export default StatusBar
