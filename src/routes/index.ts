import express from 'express'

import home from './home'
import keys from './keys'

function register (app: express.Express) {
  home.register(app)
  keys.register(app)
}

export default {
  register
}
