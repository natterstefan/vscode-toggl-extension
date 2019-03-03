# Toggl Extension for VSCode

Track your working hours in Toggl directly in your VS Code.

## Features

- WIP

## Requirements

```sh
node ^10.14.2
vs code ^1.27.1
```

## Extension Settings

Currently the extension does only adds a few VS Code settings through
the `contributes.configuration` extension point.

For example:

- `vscodens.text`: defines the text for the HelloWorld command (Default:
  "Hello World :)")

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

- [VS Code API](https://code.visualstudio.com/api/references/vscode-api)
- [Contribution Points](https://code.visualstudio.com/api/references/contribution-points)
- [Extension Manifest](https://code.visualstudio.com/api/references/extension-manifest)
- [Activation Events](https://code.visualstudio.com/api/references/activation-events)
- [Your first VS Code extension by Christian Brevik](https://blog.novanet.no/your-first-vs-code-extension/)

### Commands

- [Extension Guide #Command](https://code.visualstudio.com/api/extension-guides/command)
- [API References #Commands](https://code.visualstudio.com/api/references/vscode-api#commands)

## Licence

[MIT](./LICENCE)

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