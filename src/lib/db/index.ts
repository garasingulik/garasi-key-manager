import config from '../../config'
import sqlite from './sqlite'

// You can add implementation for database here
// tslint:disable-next-line: no-console
console.log(`Using "${config.db.type}" as database backend ...`)

function getDB () {
  switch (config.db.type.toLowerCase()) {
    case 'sqlite':
      return sqlite
    default:
      return sqlite
  }
}

const db = getDB()

export default db
