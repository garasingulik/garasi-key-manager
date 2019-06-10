import express from 'express'

const register = (app: express.Express): void => {
  app.get('/', (req, res) => {
    const data = {
      status: 'Server is running ...',
      time: new Date()
    }
    res.status(200).json(data)
  })
}

export default {
  register
}
