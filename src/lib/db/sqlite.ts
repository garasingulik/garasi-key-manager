import sqlite3 from 'sqlite3'

import * as T from '../types'

import config from '../../config'
import keywrap from '../keywrap'

const db = new sqlite3.Database(config.db.connectionString)

db.on('error', (err) => {
  // tslint:disable-next-line: no-console
  console.error('CANNOT OPEN DB')
  // tslint:disable-next-line: no-console
  console.error(err)
})

const createKey = (key: T.KeyDetail): Promise<T.KeyDetail> => {
  return new Promise((resolve, reject) => {
    const params = {
      $kid: key.kid,
      // tslint:disable-next-line: object-literal-sort-keys
      $ek: key.ek,
      $kekId: key.kekId,
      $info: key.info,
      $contentId: key.contentId,
      $expiration: 0
    }
    if (key.expiration) {
      // tslint:disable-next-line: strict-type-predicates
      if (typeof key.expiration === 'string') {
        try {
          const date = new Date(key.expiration).getTime() / 1000
          if (!isNaN(date)) {
            params.$expiration = date
          }
        } catch (err) {
          return reject(err)
        }
      }
    }
    // tslint:disable-next-line: max-line-length
    db.run('INSERT INTO Keys (kid, ek, kekId, info, contentId, expiration, lastUpdate) VALUES ($kid, $ek, $kekId, $info, $contentId, $expiration, strftime("%s", "now"))', params, (err: Error, result: sqlite3.RunResult) => {
      if (err) {
        return reject(err)
      }
      return resolve(key)
    })
  })
}

const getKeyCount = (): Promise<number> => {
  return new Promise((resolve, reject) => {
    db.get('SELECT COUNT(*) FROM Keys', (err: Error, result: any) => {
      if (err) {
        return reject(err)
      }
      return resolve(result['COUNT(*)'])
    })
  })
}

const getKeys = (kids: string[] = [], kek: string): Promise<T.Key[]> => {
  const rows: T.Key[] = []
  return new Promise((resolve, reject) => {
    const localProgressCallback = (err: Error, result: T.KeyDetail | T.KeyDetail[]) => {
      if (err) {
        return reject(err)
      }
      if (kids && kids.length > 1 && Array.isArray(result)) {
        // reorder the result to match the KID order
        const indexed: T.KeyIndex = {}
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < result.length; i++) {
          indexed[result[i].kid] = result[i]
        }
        const reordered = []
        for (let i = 0; i < kids.length; i++) {
          reordered[i] = indexed[kids[i]]
        }
        result = reordered
      }

      if (!Array.isArray(result)) {
        if (kek) {
          const unwrapped = keywrap.unwrapKey(result.ek, kek)
          if (unwrapped) {
            result.k = unwrapped.toString('hex')
          }
        }
        rows.push(result)
      }

      if (kids && Array.isArray(result)) {
        return resolve(result)
      }
    }
    const localCompletionCallback = (err: Error, result: sqlite3.Statement) => {
      // tslint:disable-next-line: no-console
      console.log(`Rows: ${result} row(s)`)
      if (err) {
        return reject(err)
      }
      return resolve(rows)
    }
    if (kids.length > 0) {
      db.all('SELECT * FROM Keys WHERE ' + kidPlaceholders(kids.length), kids, localProgressCallback)
    } else {
      // get all keys
      db.each('SELECT * FROM Keys', localProgressCallback, localCompletionCallback)
    }
  })
}

const putKey = (kid: string, key: T.KeyDetail): Promise<T.KeyDetail> => {
  return new Promise((resolve, reject) => {
    const sql = []
    const params = []
    if (key.ek) {
      sql.push('ek = ?')
      params.push(key.ek)
    }
    if (key.kekId !== '') {
      sql.push(' kekId = ?')
      params.push(key.kekId)
    }
    if (key.info !== '') {
      sql.push(' info = ?')
      params.push(key.info)
    }
    if (key.contentId !== '') {
      sql.push(' contentId = ?')
      params.push(key.contentId)
    }
    if (sql.length === 0) {
      // tslint:disable-next-line: no-console
      console.log('nothing to update')
      return reject(new Error('Invalid Parameters'))
    }
    params.push(kid)
    db.run('UPDATE Keys SET ' + sql.join(',') + ' WHERE kid = ?', params, (err: Error, result: sqlite3.RunResult) => {
      if (err) {
        return reject(err)
      } else {
        if (result.changes === 0) {
          return reject(new Error('Not Found'))
        }
      }
      return resolve(key)
    })
  })
}

const deleteKeys = (kids: string[]): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM Keys WHERE ' + kidPlaceholders(kids.length), kids, (err: Error, result: sqlite3.RunResult) => {
      if (err) {
        return reject(err)
      }
      return resolve()
    })
  })
}

const kidPlaceholders = (kidCount: number): string => {
  const placeholders: string[] = []
  for (let i = 0; i < kidCount; i++) {
    placeholders[i] = 'kid = ?'
  }
  return placeholders.join(' OR ')
}

export default {
  createKey,
  deleteKeys,
  getKeyCount,
  getKeys,
  putKey
}
