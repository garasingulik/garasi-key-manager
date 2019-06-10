import development from './development'
import production from './production'
import staging from './staging'

// tslint:disable-next-line: interface-name
interface DBBaseConfig {
  type: string
}

// tslint:disable-next-line: interface-name
export interface SQLiteConfig extends DBBaseConfig {
  connectionString: string,
  verbose: boolean
}

export type DBConfig = SQLiteConfig

// tslint:disable-next-line: interface-name
export interface Config {
  db: DBConfig
}

export const NODE_ENV = process.env.NODE_ENV || 'development'

function getConfig (): Config {
  switch (NODE_ENV) {
    case 'production': {
      return production
    }
    case 'staging': {
      return staging
    }
    default: {
      return development
    }
  }
}

const config = getConfig()

export default config
