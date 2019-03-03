import { window, workspace } from 'vscode' // eslint-disable-line
import TogglClient from 'toggl-api'
import moment from 'moment'

import CONSTANTS from '../constants'
import Poller from '../utils/poller'
import { getExtensionSetting } from '../utils'

const ERRORS = {
  missingApiToken: `${
    CONSTANTS.name
  }: Please configure your API token, before using the extension.`,
}

const prepareTogglItem = item => {
  // prepare a readable duration text
  const duration = item.duration
    ? (Date.now() / 1000 + item.duration) * 1000
    : 0
  const durationText = moment.duration(duration).humanize()

  return {
    ...item,
    durationText,
  }
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
  getCurrentTimeEntry() {
    return new Promise((resolve, reject) => {
      if (!this.apiClient) {
        reject(ERRORS.missingApiToken)
        return
      }
      console.log('fetching data from toggl...')

      this.apiClient.getCurrentTimeEntry((error, togglItem) => {
        if (error) {
          reject(error)
          return
        }

        console.log('received data from toggl...')
        resolve(prepareTogglItem(togglItem))
      })
    })
  }

  pollCurrentTimeEntry(cb) {
    const timeout = getExtensionSetting('pollingTimeout') * 1000 || 10000
    const safeTimeout = timeout < 10000 ? 10000 : timeout // min 10s to not reach the rate-limit

    // note: this is previous request + processing time + timeout
    const poller = new Poller(safeTimeout)

    // Wait till the timeout sent our event to the EventEmitter
    poller.onPoll(async () => {
      try {
        // fetch data
        const result = await this.getCurrentTimeEntry()

        // send result to callback
        cb(null, result)

        // and start next polling cycle
        poller.poll() // Go for the next poll
      } catch (error) {
        cb(error, null)
      }
    })

    // initial start
    poller.poll(true)
  }
}

export default TogglApiClient
