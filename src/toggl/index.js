import { workspace } from 'vscode' // eslint-disable-line
import TogglClient from '@natterstefan/toggl-api'
import moment from 'moment'

import { SettingsError } from '../errors'
import { getExtensionSetting, logger, Poller } from '../utils'

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

    // setup polling feature
    const timeout = getExtensionSetting('pollingTimeout') * 1000 || 3000
    const safeTimeout = timeout < 3000 ? 3000 : timeout // min 3s to not reach the rate-limit
    // note: this is previous request + processing time + timeout
    this.poller = new Poller(safeTimeout)
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
   * pollCurrentTimeEntry: will poll every x-seconds (min. 1s) and get the
   * currently tracked entry from toggl.com. It will also retry 10 times (with
   * an exponential retry timeout of 2 * interval).
   *
   * @param {function} cb
   *
   * polling with retry logic inspired by (thanks):
   * - https://gitlab.com/snippets/1775781
   * - https://dev.to/ycmjason/javascript-fetch-retry-upon-failure-3p6g
   * - https://gist.github.com/briancavalier/842626
   */
  pollCurrentTimeEntry(cb) {
    // the actual function that is invoked when a polling cycle starts
    const maxInterval = 1000 * 30 // 30s
    const pollingFn = async (retriesLeft = 10, interval = 1000) => {
      try {
        const result = await this.getCurrentTimeEntry()

        // send result to callback
        cb(null, result)

        // trigger next polling cycle
        this.poller.poll()
      } catch (error) {
        logger('error', error)

        if (retriesLeft) {
          logger('log', `retry polling (${retriesLeft} tries left)...`)

          // wait and retry
          setTimeout(
            () => {
              pollingFn(retriesLeft - 1, interval * 2)
            },
            // increase interval with every timeout, until we reached maxInterval
            interval <= maxInterval ? interval : maxInterval,
          )

          return
        }

        // something went wrong ...
        const msg =
          'Could not properly fetch data from Toggl. You are either offline or something else happened. Please, check your internet connection, reload your window and try it again.'
        cb(msg, null)
      }
    }

    // Wait till the timeout sent our event to the EventEmitter
    this.poller.onPoll(pollingFn)

    // initial start
    pollingFn()
  }
}

export default TogglApiClient
