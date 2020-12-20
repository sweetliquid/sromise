// HOF (Higher Order Function)
const withAsync = fn => (...args) => queueMicrotask(() => fn(...args))
const withArgs = (...args) => fn => fn(...args)

// State
const PENDING = 'PENDING'
const FULFILLED = 'FULFILLED'
const REJECTED = 'REJECTED'

class Promise {
  static resolve() {
    // TODO
  }

  static reject() {
    // TODO
  }

  static all() {
    // TODO
  }

  static race() {
    // TODO
  }

  static promisify() {
    // TODO
  }

  constructor(executor) {
    try {
      executor(this._resolve, this._reject)
    } catch (err) {
      this._reject(err)
    }
  }

  _state = PENDING
  _value = null
  _reason = null
  _resolveListeners = []
  _rejectListeners = []

  _resolve = value => {
    if (this._state !== PENDING) return

    this._state = FULFILLED
    this._value = value
    this._resolveListeners.forEach(withArgs(value))
  }

  _reject = reason => {
    if (this._state !== PENDING) return

    this._state = REJECTED
    this._reason = reason
    this._rejectListeners.forEach(withArgs(reason))
  }

  _addResolveListener = listener => {
    const listenerAsync = withAsync(listener)

    if (this._state === FULFILLED) {
      listenerAsync(this._value)
    } else if (this._state === PENDING) {
      this._resolveListeners.push(listenerAsync)
    }
  }

  _addRejectListener = listener => {
    const listenerAsync = withAsync(listener)

    if (this._state === REJECTED) {
      listenerAsync(this._reason)
    } else if (this._state === PENDING) {
      this._rejectListeners.push(listenerAsync)
    }
  }

  then(onFulfilled, onRejected) {
    if (typeof onFulfilled !== 'function') {
      onFulfilled = value => value
    }

    if (typeof onRejected !== 'function') {
      onRejected = reason => {
        throw reason
      }
    }

    const nextPromise = new Promise((_, nextReject) => {
      this._addResolveListener(value => {
        try {
          nextPromise._resolvePromise(onFulfilled(value))
        } catch (err) {
          nextReject(err)
        }
      })

      this._addRejectListener(reason => {
        try {
          nextPromise._resolvePromise(onRejected(reason))
        } catch (err) {
          nextReject(err)
        }
      })
    })

    return nextPromise
  }

  _resolvePromise = (promiseMaybe, chain = []) => {
    // guardians
    if (this === promiseMaybe) {
      return this._reject(
        new TypeError('`promise` and `x` refer to the same object')
      )
    }

    if (
      promiseMaybe == null ||
      !['object', 'function'].includes(typeof promiseMaybe)
    ) {
      return this._resolve(promiseMaybe)
    }

    const then = promiseMaybe.then

    if (typeof then !== 'function') {
      return this._resolve(promiseMaybe)
    }

    if (chain.includes(promiseMaybe)) {
      return this._reject(
        new TypeError('thenable participates in a circular thenable chain')
      )
    }

    // recursion
    let called = false

    try {
      then.call(
        promiseMaybe,
        value => {
          if (called) return
          called = true
          this._resolvePromise(value, [...chain, promiseMaybe])
        },
        reason => {
          if (called) return
          called = true
          this._reject(reason)
        }
      )
    } catch (err) {
      if (called) return
      called = true
      this._reject(err)
    }
  }

  catch = () => {
    // TODO
  }

  finally = () => {
    // TODO
  }
}

Promise.defer = Promise.deferred = function () {
  let dfd = {}
  dfd.promise = new Promise((resolve, reject) => {
    dfd.resolve = resolve
    dfd.reject = reject
  })
  return dfd
}

export default Promise
