export const CONSTANTS = {
  name: 'Toggl for VS Code',
  prefix: 'toggl', // keep in sync with package.json
}

const createElementName = name => `${CONSTANTS.prefix}.${name}`

// internal (for the extension) and public event names
export const EVENTS = {
  updateStatusBar: createElementName('udpateStatusbar'),
  startEntry: createElementName('startEntry'),
  startExistingEntry: createElementName('startExistingEntry'),
  stopEntry: createElementName('stopEntry'),
  startPolling: createElementName('startPolling'),
  openToggl: createElementName('openToggl'),
  fetchToggl: createElementName('fetchToggl'),
}
