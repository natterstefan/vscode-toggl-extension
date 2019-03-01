/**
 * Docs
 * - https://code.visualstudio.com/docs/extensions/overview
 *
 * Examples
 * - https://code.visualstudio.com/docs/extensions/example-hello-world
 * - https://github.com/Microsoft/vscode-extension-samples
 *
 * Publishing
 * - https://code.visualstudio.com/docs/extensions/publish-extension
 */
const vscode = require('vscode') // eslint-disable-line
const initCommands = require('./commands')
const initStatusbar = require('./statusbar')

function activate(context) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  console.log('"vs-code-extension-ns" is now active! Congrats!') // eslint-disable-line

  // initialise features
  initCommands(context)
  initStatusbar(context)
}

exports.activate = activate
