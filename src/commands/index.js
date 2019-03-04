/**
 * Docs
 * - https://code.visualstudio.com/api/extension-guides/command#creating-new-commands
 */
import { commands, window } from 'vscode' // eslint-disable-line
import { createElementName } from '../utils'

class Commands {
  constructor(context, togglClient, statusBar) {
    this.context = context
    this.togglClient = togglClient
    this.statusBar = statusBar
  }

  initCommands() {
    // The command has been defined in the package.json file
    // The commandId parameter must match the command field in package.json
    // only commands added to package.json are exposed in the command palette
    const allCommands = [
      this.commandStartEntry,
      this.commandStartExistingEntry,
      this.commandStopEntry,
    ]
    allCommands.forEach(i => i())
  }

  doReportMessage(message) {
    window.showErrorMessage(message)
  }

  doStart = async description => {
    if (!description) {
      this.doReportMessage('Entry is not valid. Please try it again')
      return
    }

    // prepare the item and start tracking
    const togglItem = this.togglClient.buildTogglItem(description)
    const result = await this.togglClient.startTimeEntry(togglItem)

    // finally display result in statusbar
    const humanTogglItrem = this.togglClient.buildHumanizedTogglItem(result)
    this.statusBar.showCurrentTimeFromTogglItem(humanTogglItrem)
  }

  doStop = async () => {
    await this.togglClient.stopTimeEntry()
    this.statusBar.resetBar()
  }

  commandStartEntry = () => {
    const commandId = createElementName('startEntry')
    const commandHandler = async () => {
      const result = await window.showInputBox({
        prompt: 'Enter the Entry Name',
      })
      this.doStart(result)
    }

    // activate the command
    const command = commands.registerCommand(commandId, commandHandler)
    this.context.subscriptions.push(command)
  }

  commandStartExistingEntry = () => {
    const commandId = createElementName('startExistingEntry')
    const commandHandler = async () => {
      const entries = await this.togglClient.getAllEntries()
      window.showQuickPick(entries.map(i => i.description), {}).then(value => {
        window.showInformationMessage(`Create Entry for ${value}`)
        this.doStart(value)
      })
    }

    // activate the command
    const command = commands.registerCommand(commandId, commandHandler)
    this.context.subscriptions.push(command)
  }

  commandStopEntry = () => {
    const commandId = createElementName('stopEntry')
    const commandHandler = this.doStop

    // activate the command
    const command = commands.registerCommand(commandId, commandHandler)
    this.context.subscriptions.push(command)
  }
}

export default Commands
