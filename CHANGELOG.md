# Changelog - Toggl Extension for VSCode

All notable changes to this project will be documented here. The format is based
on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/) and this project
adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## Unreleased

### Features

- text for new entry can be selected in editor ([#15](https://github.com/natterstefan/vscode-toggl-extension/pull/15)),
  thank you [pavelsuk](https://github.com/pavelsuk)

## 2019/10/19 0.3.1

### Fixed

- fix "Cannot find module 'toggl-api'." issue

## 2019/10/18 0.3.0

### Added

- Status Bar: onClick command can be customized (`toggl.statusBarCommand`)

### Updated

- chore: updated (dev)Dependencies, incl. node (10.x -> 12.12.x)

## 2019/04/06 0.2.0

### Added

- added new command `fetchToggl` which allows user to fetch data from toggl
  manually
- added `executeCommand('toggl.startEntry')` test
- `nock` for extended tests

### Changed

- reduce statusbar width by changing the output text when tracking and when not
- move from custom method to change statusbar to "internal" (not exposed in
  package.json) vs code command
- improve polling with better retry-handling
- new setting `toggl.maxChars`: Max. number of chars of the entry title shown in
  the status bar (default: 50).

## 2019/03/06 0.1.0

### Added

- Initial extension setup
- Toggl tracking setup with features like: start, startExisting, stop and status
  bar (displaying currently tracked entry)
