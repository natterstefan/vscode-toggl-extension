# Changelog - Toggl Extension for VSCode

All notable changes to this project will be documented here. The format is based
on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/) and this project
adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## Unreleased

### Added

- added new command `fetchToggl` which allows user to fetch data from toggl
  manually
- added `executeCommand('toggl.startEntry')` test
- `nock` for extended tests

### Changed

- reduce statusbar width by changing the output text when tracking and when not
- move from custom method to change statusbar to "internal" (not exposed in
  package.json) vs code command

## 2019/03/06 0.1.0

### Added

- Initial extension setup
- Toggl tracking setup with features like: start, startExisting, stop and status
  bar (displaying currently tracked entry)