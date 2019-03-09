/**
 * Docs
 * - https://code.visualstudio.com/api/extension-guides/command#creating-new-commands
 */
import { commands, window, Uri } from 'vscode' // eslint-disable-line
import { createElementName } from '../utils'

/**
 * Commands: takes care of implementing and activating VS Code commands
 *
 * They can be exposed in the package.json or used by this or other extensions
 * internally
 */
class Commands {
  constructor(context, togglClient, statusBar) {
    this.context = context
    this.togglClient = togglClient
    this.statusBar = statusBar // instance of ../statusbar/index.js
  }

  initCommands() {
    // The command has been defined in the package.json file
    // The commandId parameter must match the command field in package.json
    // only commands added to package.json are exposed in the command palette
    const allCommands = [
      this.commandStartEntry,
      this.commandStartExistingEntry,
      this.commandStopEntry,
      this.commandPollExistingEntry,
      this.commandOpenToggl,
    ]
    allCommands.forEach(i => i())
  }

  doReportMessage(message) {
    const msg = message || 'An error occured. Please try again.'
    window.showErrorMessage(msg)
  }

  doStart = async description => {
    if (!description) {
      this.doReportMessage('Entry is not valid. Please try it again')
      return
    }

    try {
      // prepare the item and start tracking
      const togglItem = this.togglClient.buildTogglItem(description)
      const result = await this.togglClient.startTimeEntry(togglItem)

      // finally display result in statusbar
      const humanTogglItrem = this.togglClient.buildHumanizedTogglItem(result)
      this.statusBar.showCurrentTimeFromTogglItem(humanTogglItrem)

      // tell the user everything worked
      window.showInformationMessage(`Started tracking "${description}"`)
    } catch (error) {
      // TODO: handle error properly
      this.doReportMessage(error.message)
      console.error(error)
    }
  }

  doStop = async () => {
    try {
      await this.togglClient.stopTimeEntry()
      this.statusBar.resetBar()

      // tell the user everything worked
      window.showInformationMessage(`Stopped tracking.`)
    } catch (error) {
      // TODO: handle error properly
      this.doReportMessage(error.message)
      console.error(error)
    }
  }

  commandStartEntry = () => {
    const commandId = createElementName('startEntry')
    const commandHandler = async () => {
      try {
        const result = await window.showInputBox({
          prompt: 'Enter the name of the entry',
        })
        this.doStart(result)
      } catch (error) {
        // TODO: handle error properly
        this.doReportMessage(error.message)
        console.error(error)
      }
    }

    // activate the command
    const command = commands.registerCommand(commandId, commandHandler)
    this.context.subscriptions.push(command)
  }

  commandStartExistingEntry = () => {
    const commandId = createElementName('startExistingEntry')
    const commandHandler = async () => {
      try {
        const entries = await this.togglClient.getAllEntries()
        window
          .showQuickPick(entries.map(i => i.description), {})
          .then(value => {
            this.doStart(value)
          })
      } catch (error) {
        // TODO: handle error properly
        this.doReportMessage(error.message)
        console.error(error)
      }
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

  commandPollExistingEntry = () => {
    const commandId = createElementName('startPolling')
    const commandHandler = () => {
      // TODO: make sure someone can stop & restart polling
      // start fetching current time entry and display it in statusbar
      this.togglClient.pollCurrentTimeEntry((error, data) => {
        if (error) {
          // ATTENTION: currently we do not restart fetching!
          this.doReportMessage(error.message)
          console.error(error)
          return
        }

        this.statusBar.showCurrentTimeFromTogglItem(data)
      })
    }

    // activate the command
    const command = commands.registerCommand(commandId, commandHandler)
    this.context.subscriptions.push(command)
  }

  commandOpenToggl = () => {
    const commandId = createElementName('openToggl')
    const commandHandler = () => {
      commands.executeCommand(
        'vscode.open',
        Uri.parse('https://toggl.com/app/timer'),
      )
    }

    // activate the command
    const command = commands.registerCommand(commandId, commandHandler)
    this.context.subscriptions.push(command)
  }
}

export default Commands
