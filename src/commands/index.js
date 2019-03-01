const vscode = require('vscode') // eslint-disable-line

function initCommands(context) {
  // The command has been defined in the package.json file
  // The commandId parameter must match the command field in package.json
  const disposable = vscode.commands.registerCommand(
    'extension.sayHello',
    () => {
      const text = vscode.workspace.getConfiguration().get('vscodens.text')
      vscode.window.showInformationMessage(text)
    },
  )

  context.subscriptions.push(disposable)
}

module.exports = initCommands
