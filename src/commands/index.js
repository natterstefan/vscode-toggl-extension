/**
 * Docs
 * - https://code.visualstudio.com/api/extension-guides/command#creating-new-commands
 */
import { commands, window, Uri } from 'vscode' // eslint-disable-line
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
      this.commandPollExistingEntry,
      this.commandOpenToggl,
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
      console.error(error)
    }
  }

  commandStartEntry = () => {
    const commandId = createElementName('startEntry')
    const commandHandler = async () => {
      try {
        const result = await window.showInputBox({
          prompt: 'Enter the Entry Name',
        })
        this.doStart(result)
      } catch (error) {
        // TODO: handle error properly
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

  // TODO: make sure someone can stop polling
  commandPollExistingEntry = () => {
    const commandId = createElementName('startPolling')
    const commandHandler = () => {
      // start fetching current time entry and display it in statusbar
      this.togglClient.pollCurrentTimeEntry((err, data) => {
        if (err) {
          // ATTENTION: currently we do not restart fetching!
          console.error(err)
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
