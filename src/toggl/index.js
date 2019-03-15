import { workspace } from 'vscode' // eslint-disable-line
import TogglClient from 'toggl-api'
import moment from 'moment'

import { SettingsError } from '../errors'
import { getExtensionSetting, Poller } from '../utils'

/**
 * TogglApiClient
 *
 * provides several helper methods to easily access the toggl API.
 *
 * Docs
 * - https://github.com/7eggs/node-toggl-api
 * - https://github.com/toggl/toggl_api_docs
 */
export class TogglApiClient {
  constructor(context) {
    // setup client based on settings
    this.prepareClient()

    // make sure we know when the user changed the settings to receive/determine
    // a new api token
    context.subscriptions.push(
      workspace.onDidChangeConfiguration(() => this.prepareClient()),
    )
  }

  // SETUP
  prepareClient() {
    // create new toggl client
    const settingName = 'apiKey'
    this.apiToken = getExtensionSetting(settingName)

    if (!this.apiToken) {
      throw new SettingsError(settingName)
    }

    // update the project details
    this.defaultProjectId = getExtensionSetting('defaultProjectId')

    // and (re-)create the api client
    this.apiClient = new TogglClient({
      apiToken: this.apiToken,
    })
  }

  // UTILS
  buildTogglItem(description) {
    // in the future other flags like billable could be added as well
    return {
      description,
      pid: this.defaultProjectId,
    }
  }

  buildHumanizedTogglItem(item) {
    if (!item) {
      return null
    }

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

  // API
  /**
   * docs: https://github.com/7eggs/node-toggl-api/blob/80d6796422aa71b95fbd5d3fc371c0a203cd9d78/lib/api/time_entries.js#L72-L105
   */
  getAllEntries() {
    return new Promise((resolve, reject) => {
      // params: startDate, endDate, callback
      this.apiClient.getTimeEntries(undefined, undefined, (err, togglItems) => {
        if (err) {
          reject(err)
          return
        }

        if (togglItems === []) {
          resolve([])
          return
        }

        // prepare all togglItems and return only unique ones (https://stackoverflow.com/a/14438954/1238150)
        const entries =
          (togglItems &&
            togglItems
              .map(this.buildHumanizedTogglItem)
              .filter(item => !!(item && item.description))
              .filter(
                (value, index, self) =>
                  self.findIndex(
                    elem => elem.description === value.description,
                  ) === index,
              )) ||
          []

        resolve(entries)
      })
    })
  }

  /**
   * docs: https://github.com/7eggs/node-toggl-api/blob/80d6796422aa71b95fbd5d3fc371c0a203cd9d78/lib/api/time_entries.js#L108-L117
   */
  getCurrentTimeEntry() {
    return new Promise((resolve, reject) => {
      if (!this.apiClient) {
        throw new SettingsError()
      }

      this.apiClient.getCurrentTimeEntry((error, togglItem) => {
        if (error) {
          reject(error)
          return
        }

        // NOTE: one could also fetch the project name here now
        resolve(this.buildHumanizedTogglItem(togglItem))
      })
    })
  }

  /**
   * docs: https://github.com/7eggs/node-toggl-api/blob/80d6796422aa71b95fbd5d3fc371c0a203cd9d78/lib/api/time_entries.js#L129-L149
   *
   * @param {object} newTogglItem
   */
  startTimeEntry(newTogglItem) {
    return new Promise((resolve, reject) => {
      this.apiClient.startTimeEntry(newTogglItem, (error, togglItem) => {
        if (error) {
          reject(error)
          return
        }

        resolve(this.buildHumanizedTogglItem(togglItem))
      })
    })
  }

  /**
   * docs: https://github.com/7eggs/node-toggl-api/blob/80d6796422aa71b95fbd5d3fc371c0a203cd9d78/lib/api/time_entries.js#L152-L165
   */
  async stopTimeEntry() {
    const togglItem = await this.getCurrentTimeEntry()
    return new Promise((resolve, reject) => {
      if (!togglItem) {
        reject(new Error('No current Entry available.'))
        return
      }

      const { id } = togglItem
      this.apiClient.stopTimeEntry(id, error => {
        if (error) {
          reject(error)
          return
        }
        resolve()
      })
    })
  }

  // POLLING
  /**
   * pollCurrentTimeEntry: will poll every x-seconds (min. 3) and get the
   * currently tracked entry from toggl.com
   *
   * @param {function} cb
   */
  pollCurrentTimeEntry(cb) {
    const timeout = getExtensionSetting('pollingTimeout') * 1000 || 3000
    const safeTimeout = timeout < 3000 ? 3000 : timeout // min 3s to not reach the rate-limit

    // note: this is previous request + processing time + timeout
    const poller = new Poller(safeTimeout)

    // Wait till the timeout sent our event to the EventEmitter
    poller.onPoll(async () => {
      try {
        // fetch data
        const result = await this.getCurrentTimeEntry()

        // send result to callback
        cb(null, result)

        // TODO: make sure invoker of the func can stop polling and restart it
        poller.poll()
      } catch (error) {
        cb(error, null)
      }
    })

    // initial start
    poller.poll(true)
  }
}

export default TogglApiClient
