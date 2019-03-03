/**
 * Docs
 * - https://code.visualstudio.com/api/extension-guides/command#creating-new-commands
 */
import { commands, window } from 'vscode' // eslint-disable-line
import { createElementName, getExtensionSetting } from '../utils'

class Commands {
  constructor(context) {
    this.context = context
  }

  initCommands() {
    // The command has been defined in the package.json file
    // The commandId parameter must match the command field in package.json
    // only commands added to package.json are exposed in the command palette
    const commandId = createElementName('sayHello')
    const commandHandler = () => {
      const text = getExtensionSetting('text')
      window.showInformationMessage(text)
    }
    const command = commands.registerCommand(commandId, commandHandler)

    // activate the command
    this.context.subscriptions.push(command)
  }
}

export default Commands
