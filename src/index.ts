import errorHandler from 'errorhandler'
import express from 'express'
import logger from 'morgan'

import * as bodyParser from 'body-parser'
import * as fs from 'fs'
import * as https from 'https'

import routes from './routes'

// server init
const port = process.env.PORT || 8000
process.env.NODE_ENV = process.env.NODE_ENV || 'development'

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(logger('dev'))

// registering routes
routes.register(app)

// error handling middleware should be loaded after the loading the routes
if (app.get('env') === 'development') {
  app.use(errorHandler())
}

let httpsServer = https.createServer({
  key: fs.readFileSync('./dev.garasingulik.com-key.pem').toString(),
  cert: fs.readFileSync('./dev.garasingulik.com.pem').toString()
}, app)

httpsServer.listen(port, () => {
  console.log(`App listening on port ${port} (HTTPS)!`)
})
