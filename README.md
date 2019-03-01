# vs-code-toggl-extension

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

## Licence

[MIT](./LICENCE)

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
)