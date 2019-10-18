# Toggl Extension for VSCode

[![Build Status](https://travis-ci.com/natterstefan/vscode-toggl-extension.svg?branch=master)](https://travis-ci.com/natterstefan/vscode-toggl-extension) [![Marketplace Version](https://vsmarketplacebadge.apphb.com/version/natterstefan.vs-code-toggl-extension.svg 'Current Release')](https://marketplace.visualstudio.com/items?itemName=natterstefan.vs-code-toggl-extension) [![Installs](https://vsmarketplacebadge.apphb.com/installs/natterstefan.vs-code-toggl-extension.svg 'Current Release')](https://marketplace.visualstudio.com/items?itemName=natterstefan.vs-code-toggl-extension) [![downloads](https://vsmarketplacebadge.apphb.com/downloads/natterstefan.vs-code-toggl-extension.svg 'Current Release')](https://marketplace.visualstudio.com/items?itemName=natterstefan.vs-code-toggl-extension)

Track your working hours with [Toggl](https://toggl.com) directly in Visual
Studio Code :watch:

## Features and Commands

## Commands

- `toggl.startEntry`: starts a new entry on toggl.com with the provided input
- `toggl.startExistingEntry` starts an existing entry on toggl
- `toggl.stopEntry`: stops the current entry
- `toggl.openToggl`: opens [toggl.com](https://toggl.com/app/timer) in the browser
- `toggl.fetchToggl`: fetch current toggl entry from [toggl.com](https://toggl.com/app/timer)

## Features

- status bar shows current task and opens toggl.com when clicked
- Polling: fetches data periodically from toggl to show the current task in the
  status bar

## Extension Settings

Currently the extension does provide the following settings:

- `toggl.apiKey`: your [private API key](https://www.toggl.com/app/profile)
- `toggl.defaultProjectId`: all created tasks will use this as assigned project.
  You can [get the id from the projects overview](https://www.toggl.com/app/projects).
  Simply select the project and obtain the id from the url. Example: the id of
  `https://www.toggl.com/app/projects/xxxxx/edit/12345678` would be `12345678`
- `toggl.pollingTimeout` (Default: 3): timeout between polling intervals, when the extension
  fetchs the latest current task from toggl. In order to not hit [toggl's rate limit](https://github.com/toggl/toggl_api_docs#the-api-format)
  you cannot set it below 3 seconds.
- `toggl.maxChars`: Max. number of chars of the entry title shown in the status bar (default: 50).

## Development & Contribution

### Requirements

```sh
node ^12.12.0
vscode ^1.27.1
```

## How to develop

In order to run the VS Code in debugger mode execute the `View: Show Debug`
command and start the `Extension` task (see configuration in
[.vscode/launch.json](.vscode/launch.json)).

A new VS Code Window in debugger mode will open. When you changed something in
the code, you have to execute `Reload Window` to see the changes.

A guide about "Creating a VS Code Extension" can be found [here](https://code.visualstudio.com/api).

## How to test

Either open the debug tab in your VS Code and start the `Extension Test` task,
or run `npm t` in the terminal. When you run it in the terminal, make sure no
other VS Code instance is running.

[Jest](https://jestjs.io/) is used for testing, and the implementation is
[inspired by the Unibeautify/vscode package](https://github.com/Unibeautify/vscode/tree/82e360ff73516c213fea0fa6c2740f0cd53d581b/test).

## Helpful links

### Tutorials

- [Your first VS Code extension by Christian Brevik](https://blog.novanet.no/your-first-vs-code-extension/)

### Configuration and API

- [VS Code API](https://code.visualstudio.com/api/references/vscode-api)
- [Contribution Points](https://code.visualstudio.com/api/references/contribution-points)
- [Extension Manifest](https://code.visualstudio.com/api/references/extension-manifest)
- [Activation Events](https://code.visualstudio.com/api/references/activation-events)

### Commands

- [Extension Guide #Command](https://code.visualstudio.com/api/extension-guides/command)
- [API References #Commands](https://code.visualstudio.com/api/references/vscode-api#commands)

### Publishing

- [Publishing](https://code.visualstudio.com/api/working-with-extensions/publishing-extension#packaging-extensions)

## Tools

I have not yet tested these tools, but I'll keep them here for the future.

- [vscode-helpers](https://www.npmjs.com/package/vscode-helpers)

## Todos and Ideas

There are some further ideas and tasks left to make this extension better. You
can take a look at the [projects](https://github.com/natterstefan/vscode-toggl-extension/projects)
tab to see what I have in mind, planned and what is still left. Feel free to
contribute! :muscle:

## Licence

[Apache 2.0](./LICENCE)

This extension is not affiliated, associated, authorized, endorsed by or in any
way officially connected to Toggl ([toggl.com](https://toggl.com)).

## Maintainers

<table>
  <tbody>
    <tr>
      <td align="center">
        <a href="https://github.com/natterstefan">
          <img width="150" height="150" src="https://github.com/natterstefan.png?v=3&s=150">
          </br>
          Stefan Natter
        </a>
        <div>
          <a href="https://twitter.com/natterstefan">
            <img src="https://img.shields.io/twitter/follow/natterstefan.svg?style=social&label=Follow" />
          </a>
        </div>
      </td>
    </tr>
  <tbody>
</table>
