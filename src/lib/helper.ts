import crypto from 'crypto'

import db from './db'
import keywrap from './keywrap'

import * as T from './types'
import * as U from './utilities'

const KEKID_CONSTANT_1 = 'KEKID_1'

function computeKekId (kek: string): string {
  const hash = crypto.createHash('sha1')
  hash.update(KEKID_CONSTANT_1, 'ascii')
  hash.update(kek, 'ascii')
  return '#1.' + hash.digest('hex').substring(0, 32)
}

function kidFromString (kid: string): string {
  if (kid.indexOf('^') === 0) {
    // derive the KID using a hash
    const hash = crypto.createHash('sha1')
    hash.update(kid.slice(1), 'ascii')
    kid = hash.digest('hex').substring(0, 32)
  }

  return kid
}

function randomize (key: T.KeyDetail): Promise<T.KeyDetail> {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(32, (err, random) => {
      if (err) {
        return reject(err)
      }
      if (!key.kid) {
        key.kid = random.slice(0, 16).toString('hex')
      }
      if (!key.ek && !key.k) {
        key.k = random.slice(16, 32).toString('hex')
      }
      return resolve(key)
    })
  })
}

function createNewKey (kek: string, key: T.KeyDetail): Promise<T.KeyDetail> {
  return new Promise(async (resolve, reject) => {
    let theKey = key
    if (!key.kid || (!key.ek && !key.k)) {
      // we need some random values
      const random = await U.wrapPromise<T.KeyDetail>(randomize(key))
      if (U.isError(random)) {
        return reject(random)
      }
      theKey = random
    }
    const newKey = await U.wrapPromise<T.KeyDetail>(storeNewKey(kek, theKey))
    if (U.isError(newKey)) {
      return reject(newKey)
    }

    return resolve(newKey)
  })
}

function storeNewKey (kek: string, key: T.KeyDetail): Promise<T.KeyDetail> {
  return new Promise(async (resolve, reject) => {
    key.kid = kidFromString(key.kid)
    if (!key.ek) {
      const ek = keywrap.wrapKey(key.k, kek)
      if (!ek) {
        return reject(new Error('Invalid Key Format'))
      }
      key.ek = ek.toString('hex')
    }
    if (key.kekId === '') {
      if (kek) {
        // compute the KEK ID from the kek itself
        key.kekId = computeKekId(kek)
      } else {
        // no KEK ID
        key.kekId = ''
      }
    }
    const result = await U.wrapPromise(db.createKey(key))
    if (U.isError(result)) {
      return reject(result)
    }
    return resolve(key)
  })
}

export default {
  createNewKey,
  kidFromString
}
