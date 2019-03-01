// based on https://github.com/Microsoft/vscode-extension-samples/tree/master/statusbar-sample
const { StatusBarAlignment, window, workspace, commands } = require('vscode') // eslint-disable-line

// TODO: remove example from yeoman generated template
function getSelectedLines() {
  const editor = window.activeTextEditor
  let text

  if (editor) {
    let lines = 0
    editor.selections.forEach(selection => {
      lines += selection.end.line - selection.start.line + 1
    })

    if (lines > 0) {
      text = `${lines} line(s) selected!`
    }
  }

  return text
}

class StatusBar {
  constructor(context) {
    this.context = context
  }

  initStatusbar() {
    // create the statusbar
    this.status = window.createStatusBarItem(StatusBarAlignment.Right, 100)
    this.status.command = 'extension.selectedLines'
    this.context.subscriptions.push(this.status)

    // NOTE: Example events
    // this.context.subscriptions.push(
    //   window.onDidChangeActiveTextEditor(() => this.updateStatus()),
    // )
    // this.context.subscriptions.push(
    //   window.onDidChangeTextEditorSelection(() => this.updateStatus()),
    // )
    // this.context.subscriptions.push(
    //   window.onDidChangeTextEditorViewColumn(() => this.updateStatus()),
    // )
    // this.context.subscriptions.push(
    //   workspace.onDidOpenTextDocument(() => this.updateStatus()),
    // )
    // this.context.subscriptions.push(
    //   workspace.onDidCloseTextDocument(() => this.updateStatus()),
    // )

    this.context.subscriptions.push(
      commands.registerCommand('extension.selectedLines', () => {
        window.showInformationMessage(this.status.text)
      }),
    )

    this.updateStatus()
  }

  updateStatus(customText) {
    const text = customText || getSelectedLines()

    if (text) {
      this.status.text = `$(megaphone) ${text}` // eslint-disable-line
    }

    if (text) {
      this.status.show()
    } else {
      this.status.hide()
    }
  }
}

export default StatusBar
