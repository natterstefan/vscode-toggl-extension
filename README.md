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

- add new entries or choose from existing entries from your toggl account
- text for new entry can be selected in editor (just select the text and execute
  the "Toggl: Start with new entry." command)
- status bar shows current task and opens toggl.com when clicked
- clicks on the status bar can execute custom command (see
  `toggl.statusBarCommand` setting below)
- polling: fetches data periodically from toggl to show the current task in the
  status bar

## Extension Settings

Currently the extension does provide the following settings:

- `toggl.apiKey`: your [private Toggl API key](https://www.toggl.com/app/profile)
- `toggl.defaultProjectId`: all created tasks will use this as assigned project.
  You can [get the id from the projects overview](https://www.toggl.com/app/projects).
  Simply select the project and obtain the id from the url. Example: the id of
  `https://www.toggl.com/app/projects/xxxxx/edit/12345678` would be `12345678`
- `toggl.pollingTimeout`: timeout between polling intervals, when the extension
  fetchs the latest current task from toggl. In order to not hit [toggl's rate limit](https://github.com/toggl/toggl_api_docs#the-api-format)
  you cannot set it below 3 seconds (default: 3).
- `toggl.maxChars`: Max. number of chars of the entry title shown in the status bar (default: 50).
- `toggl.statusBarCommand`: Choose command to be executed when Toggl status bar
  item is clicked (default: toggl.openToggl).

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

Simple execute the commands below or read more about [Publishing](https://code.visualstudio.com/api/working-with-extensions/publishing-extension#packaging-extensions)
first.

```bash
npx vsce package
npx vsce publish
```

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

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="http://twitter.com/natterstefan"><img src="https://avatars2.githubusercontent.com/u/1043668?v=4" width="100px;" alt=""/><br /><sub><b>Stefan Natter</b></sub></a><br /><a href="https://github.com/natterstefan/vscode-toggl-extension/commits?author=natterstefan" title="Code">💻</a> <a href="https://github.com/natterstefan/vscode-toggl-extension/commits?author=natterstefan" title="Documentation">📖</a> <a href="#ideas-natterstefan" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/natterstefan/vscode-toggl-extension/commits?author=natterstefan" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/pavelsuk"><img src="https://avatars3.githubusercontent.com/u/2633298?v=4" width="100px;" alt=""/><br /><sub><b>Pavel Suk</b></sub></a><br /><a href="https://github.com/natterstefan/vscode-toggl-extension/commits?author=pavelsuk" title="Code">💻</a> <a href="#ideas-pavelsuk" title="Ideas, Planning, & Feedback">🤔</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
