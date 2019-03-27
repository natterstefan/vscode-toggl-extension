/**
 * Docs
 * - https://code.visualstudio.com/api/extension-guides/command#creating-new-commands
 */
import { commands, window, Uri } from 'vscode' // eslint-disable-line
import { EVENTS } from '../constants'
import { logger } from '../utils'

/**
 * Commands: takes care of implementing and activating VS Code commands
 *
 * They can be exposed in the package.json or used by this or other extensions
 * internally
 */
class Commands {
  constructor(context, togglClient) {
    this.context = context
    this.togglClient = togglClient

    // other event handler id(s)
    this.statusBarUpdateEvent = EVENTS.updateStatusBar
  }

  init() {
    // The command has been defined in the package.json file
    // The commandId parameter must match the command field in package.json
    // only commands added to package.json are exposed in the command palette
    const allCommands = [
      this.commandStartEntry,
      this.commandStartExistingEntry,
      this.commandStopEntry,
      this.commandPollExistingEntry,
      this.commandOpenToggl,
      this.commandUpdateToggl,
    ]
    allCommands.forEach(i => i())
  }

  doStart = async description => {
    if (!description) {
      throw new Error('Entry is not valid. Please try it again.')
    }

    try {
      // prepare the item and start tracking
      const togglItem = this.togglClient.buildTogglItem(description)
      const result = await this.togglClient.startTimeEntry(togglItem)

      // make it human readable and resolve it
      const humanTogglItrem = this.togglClient.buildHumanizedTogglItem(result)
      return humanTogglItrem
    } catch (error) {
      throw new Error(error.message)
    }
  }

  commandStartEntry = () => {
    const commandId = EVENTS.startEntry
    const commandHandler = async () => {
      try {
        const value = await window.showInputBox({
          prompt: 'Enter the name of the entry',
        })
        const humanTogglItem = await this.doStart(value)

        // tell the user everything worked
        window.showInformationMessage(`Started tracking "${value}"`)

        // and update the statusbar
        commands.executeCommand(this.statusBarUpdateEvent, humanTogglItem)
      } catch (error) {
        // TODO: handle error properly
        logger('error', error)
      }
    }

    // activate the command
    const command = commands.registerCommand(commandId, commandHandler)
    this.context.subscriptions.push(command)
  }

  commandStartExistingEntry = () => {
    const commandId = EVENTS.startExistingEntry
    const commandHandler = async () => {
      try {
        const entries = await this.togglClient.getAllEntries()
        const value = await window.showQuickPick(
          entries.map(i => i.description),
          {},
        )

        const humanTogglItem = await this.doStart(value)

        // tell the user everything worked
        window.showInformationMessage(`Started tracking "${value}"`)

        // and update the statusbar
        commands.executeCommand(this.statusBarUpdateEvent, humanTogglItem)
      } catch (error) {
        // TODO: handle error properly
        logger('error', error)
      }
    }

    // activate the command
    const command = commands.registerCommand(commandId, commandHandler)
    this.context.subscriptions.push(command)
  }

  commandStopEntry = async () => {
    const commandId = EVENTS.stopEntry
    const commandHandler = async () => {
      try {
        await this.togglClient.stopTimeEntry()

        // reset bar and tell the user everything worked
        commands.executeCommand(this.statusBarUpdateEvent)
        window.showInformationMessage(`Stopped tracking.`)
      } catch (error) {
        // TODO: handle error properly
        logger('error', error)
      }
    }

    // activate the command
    const command = commands.registerCommand(commandId, commandHandler)
    this.context.subscriptions.push(command)
  }

  commandPollExistingEntry = () => {
    const commandId = EVENTS.startPolling
    const commandHandler = () => {
      // TODO: make sure someone can stop & restart polling
      // start fetching current time entry and display it in statusbar
      this.togglClient.pollCurrentTimeEntry((error, togglItem) => {
        if (error) {
          // ATTENTION: currently we do not restart fetching!
          logger(
            'error',
            error,
            'Could not complete polling. Reload the window and try it again, please. If the error happens more often, try increasing the pollingTimeout.',
          )
          return
        }

        // update the statusbar
        commands.executeCommand(this.statusBarUpdateEvent, togglItem)
      })
    }

    // activate the command
    const command = commands.registerCommand(commandId, commandHandler)
    this.context.subscriptions.push(command)
  }

  commandOpenToggl = () => {
    const commandId = EVENTS.openToggl
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

  commandUpdateToggl = () => {
    const commandId = EVENTS.fetchToggl
    const commandHandler = async () => {
      try {
        const data = await this.togglClient.getCurrentTimeEntry()
        commands.executeCommand(this.statusBarUpdateEvent, data)
      } catch (error) {
        // TODO: handle error properly
        logger('error', error)
      }
    }

    // activate the command
    const command = commands.registerCommand(commandId, commandHandler)
    this.context.subscriptions.push(command)
  }
}

export default Commands
