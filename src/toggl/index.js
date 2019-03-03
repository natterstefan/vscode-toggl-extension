import { window, workspace } from 'vscode' // eslint-disable-line
import TogglClient from 'toggl-api'

import CONSTANTS from '../constants'

const ERRORS = {
  missingApiToken: `${
    CONSTANTS.name
  }: Please configure your API token, before using the extension.`,
}

/**
 * TogglApiClient
 *
 * provides several helper methods to easily access the toggl API.
 */
export class TogglApiClient {
  constructor(context) {
    // setup client based on settings
    this.prepareClient()

    // make sure we know when the user changed the settings to receive/determine
    // a new api token
    // TODO: remove listener?
    context.subscriptions.push(
      workspace.onDidChangeConfiguration(() => this.prepareClient()),
    )
  }

  // SETUP
  prepareClient() {
    // create new toggl client
    this.apiToken = workspace.getConfiguration().get('toggl.apiKey')

    if (!this.apiToken) {
      window.showErrorMessage(ERRORS.missingApiToken)
      return
    }

    // update the project details
    this.defaultProjectId = workspace
      .getConfiguration()
      .get('toggl.defaultProjectId')

    // and (re-)create the api client
    this.apiClient = new TogglClient({
      apiToken: this.apiToken,
    })
  }

  // API HANDLERS
  // TODO: async-await
  getCurrentTimeEntry() {
    return new Promise((resolve, reject) => {
      if (!this.apiClient) {
        reject(ERRORS.missingApiToken)
        return
      }

      this.apiClient.getCurrentTimeEntry((error, togglEntry) => {
        if (error) {
          reject(error)
          return
        }

        // TODO: format date etc.
        resolve(togglEntry)
      })
    })
  }
}

export default TogglApiClient
