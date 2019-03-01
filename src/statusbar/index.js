// based on https://github.com/Microsoft/vscode-extension-samples/tree/master/statusbar-sample
const { StatusBarAlignment, window, workspace, commands } = require('vscode') // eslint-disable-line

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

function updateStatus(status) {
  const text = getSelectedLines()
  if (text) {
    status.text = `$(megaphone) ${text}` // eslint-disable-line
  }

  if (text) {
    status.show()
  } else {
    status.hide()
  }
}

function initStatusbar(context) {
  const status = window.createStatusBarItem(StatusBarAlignment.Right, 100)
  status.command = 'extension.selectedLines'
  context.subscriptions.push(status)

  context.subscriptions.push(
    window.onDidChangeActiveTextEditor(() => updateStatus(status)),
  )
  context.subscriptions.push(
    window.onDidChangeTextEditorSelection(() => updateStatus(status)),
  )
  context.subscriptions.push(
    window.onDidChangeTextEditorViewColumn(() => updateStatus(status)),
  )
  context.subscriptions.push(
    workspace.onDidOpenTextDocument(() => updateStatus(status)),
  )
  context.subscriptions.push(
    workspace.onDidCloseTextDocument(() => updateStatus(status)),
  )

  context.subscriptions.push(
    commands.registerCommand('extension.selectedLines', () => {
      window.showInformationMessage(getSelectedLines())
    }),
  )

  updateStatus(status)
}

module.exports = initStatusbar
