/**
 * Docs
 * - https://code.visualstudio.com/api/extension-guides/command#creating-new-commands
 */
import { commands, window, workspace } from 'vscode' // eslint-disable-line

class Commands {
  constructor(context) {
    this.context = context
  }

  initCommands() {
    // The command has been defined in the package.json file
    // The commandId parameter must match the command field in package.json
    const command = 'vscodetoggl.sayHello'
    const commandHandler = () => {
      const text = workspace.getConfiguration().get('vscodens.text')
      window.showInformationMessage(text)
    }

    this.context.subscriptions.push(
      commands.registerCommand(command, commandHandler),
    )
  }
}

export default Commands
