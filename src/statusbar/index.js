/**
 * Originally inspired by
 * - https://github.com/Microsoft/vscode-extension-samples/tree/8ea86205551f2b0c5cad2712c2c4a7c1b6e2a4cd/statusbar-sample
 *
 * Docs
 * - list of icons https://gist.github.com/reyawn/b23ded4ddbfe8aacf77f0581f81000a0
 */
import { StatusBarAlignment, window } from 'vscode' // eslint-disable-line
import { createElementName } from '../utils'
import CONSTANTS from '../constants'

class StatusBar {
  constructor(context) {
    this.context = context
    this.text = ''

    // bindings
    this.showCurrentTimeFromTogglItem = this.showCurrentTimeFromTogglItem.bind(
      this,
    )
  }

  initStatusbar() {
    // create the StatusBar with command onClick
    this.status = window.createStatusBarItem(StatusBarAlignment.Right, 100)
    this.status.command = createElementName('openToggl')
    this.status.tooltip = `${CONSTANTS.name}: Click to open toggl.com!`
    this.context.subscriptions.push(this.status)

    // reset bar (show initial state)
    this.resetBar()
  }

  updateStatus(text) {
    this.text = text || '-'
    this.status.text = ['$(watch) Toggl:', this.text].filter(i => !!i).join(' ') // only statusbar is capable of displaying emojis
    this.status.show()
  }

  resetBar() {
    this.updateStatus()
  }

  showCurrentTimeFromTogglItem(togglItem) {
    if (!togglItem) {
      this.resetBar()
      return
    }

    this.updateStatus(`${togglItem.description} (${togglItem.durationText})`)
  }
}

export default StatusBar
