/**
 * Originally inspired by
 * - https://github.com/Microsoft/vscode-extension-samples/tree/8ea86205551f2b0c5cad2712c2c4a7c1b6e2a4cd/statusbar-sample
 *
 * Docs
 * - list of icons https://gist.github.com/reyawn/b23ded4ddbfe8aacf77f0581f81000a0
 */
// eslint-disable-line
import { StatusBarAlignment, window, commands } from 'vscode' // eslint-disable-line
import { createElementName } from '../utils'

class StatusBar {
  constructor(context) {
    this.context = context
    this.text = ''
  }

  initStatusbar() {
    // create the StatusBar with command onClick
    this.status = window.createStatusBarItem(StatusBarAlignment.Right, 100)
    this.status.command = createElementName('statusbarClicked')
    this.context.subscriptions.push(this.status)

    // register command (currently not exposed in command palette)
    this.context.subscriptions.push(
      commands.registerCommand(this.status.command, () => {
        window.showInformationMessage(this.text)
      }),
    )

    this.updateStatus()
  }

  updateStatus(customText) {
    this.text = customText || ''

    if (this.text) {
      this.status.text = `$(watch) ${this.text}` // only statusbar is capable of displaying emojis
      this.status.show()
    } else {
      this.status.hide()
    }
  }
}

export default StatusBar
