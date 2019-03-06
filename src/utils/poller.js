/**
 * inspired by
 * - https://medium.com/@xaviergeerinck/creating-a-non-blocking-polling-system-in-node-js-with-settimeout-and-eventemitter-4aaa098d25fb
 * - https://github.com/cGuille/async-polling
 */
import EventEmitter from 'events'

class Poller extends EventEmitter {
  constructor(timeout) {
    super()
    this.timeout = timeout

    if (!this.timeout) {
      throw new Error('Cannot initialise Poller without a valid timeout')
    }
  }

  poll(startImmediatelly = false) {
    setTimeout(() => this.emit('poll'), this.timeout)

    // initially start
    if (startImmediatelly) {
      this.emit('poll')
    }
  }

  onPoll(cb) {
    this.on('poll', cb)
  }
}

export default Poller
