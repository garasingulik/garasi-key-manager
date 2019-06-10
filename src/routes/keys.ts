import express from 'express'

import db from '../lib/db'
import helper from '../lib/helper'
import keywrap from '../lib/keywrap'
import validator from '../lib/validator'

import * as T from '../lib/types'
import * as U from '../lib/utilities'

export function register (app: express.Express): void {
  app.get('/keys', async (req, res) => {
    if (!validator.checkParameters(req.query)) {
      res.status(400).send({ message: 'Invalid Parameters' })
      return
    }

    const kek = req.query.kek
    const keys = await U.wrapPromise(db.getKeys([], kek))

    if (U.isError(keys)) {
      // tslint:disable-next-line: no-console
      console.log(keys)
      res.status(500).json(keys)
      return
    }

    res.status(200).json(keys)
  })

  app.get('/keys/count', async (req, res) => {
    const result = await U.wrapPromise<number>(db.getKeyCount())
    if (U.isError(result)) {
      res.status(500).send({ message: 'Internal Server Error' })
      return
    }
    return res.status(200).json(result)
  })

  app.get('/keys/:keyIds', async (req, res) => {
    const kids = req.params.keyIds
    const kidSelector = kids.split(',')

    if (!kids || !kidSelector) {
      res.status(400).send({ message: 'Bad Request' })
      return
    }

    for (let i = 0; i < kidSelector.length; i++) {
      const kid = helper.kidFromString(kidSelector[i])
      if (!validator.checkKid(kid)) {
        res.status(400).send({ message: 'Invalid KID' })
        return
      }

      kidSelector[i] = kid
    }

    if (!kidSelector) {
      res.status(400).send({ message: 'Invalid KID' })
      return
    }

    const kek = req.query.kek
    const keys = await U.wrapPromise<T.Key[]>(db.getKeys(kidSelector, kek))
    if (U.isError(keys)) {
      // tslint:disable-next-line: no-console
      console.log(keys)
      res.status(500).json(keys)
      return
    }

    if (keys && keys.length > 0) {
      if (kek) {
        keys.forEach((k) => {
          const unwrapped = keywrap.unwrapKey(k.ek, kek)
          if (unwrapped) {
            k.k = unwrapped.toString('hex')
          } else {
            res.status(400).send({ message: 'Incorrect KEK' })
            return
          }
          delete k.ek
          delete k.kekId
        })
      }
      res.status(200).json(keys.length === 1 ? keys[0] : keys)
    } else {
      res.status(404).send({ message: 'Not Found' })
    }
  })

  app.post('/keys', async (req, res) => {
    if (!validator.checkParameters(req.query)) {
      res.status(400).json({ message: 'Invalid Parameters' })
      return
    }
    let key
    try {
      key = JSON.parse(req.body)
      if (!validator.checkKey(key)) {
        res.status(400).send({ message: 'Invalid Key Object' })
        return
      }
    } catch (err) {
      res.status(400).send({ message: 'Invalid JSON Body' })
      return
    }

    const kek = req.query.kek
    if (!kek) {
      // no kek was passed, check that an encrypted key was supplied
      if (!key.ek) {
        res.status(400).send({ message: 'No KEK passed: ek required' })
        return
      }
    }

    const newKey = await U.wrapPromise<T.KeyDetail>(helper.createNewKey(kek, key))
    if (U.isError(newKey)) {
      res.status(400).send({ message: 'Bad Request' })
      return
    }

    res.status(200).json(newKey)
  })

  app.put('/keys/:keyId', async (req, res) => {
    if (!validator.checkParameters(req.query)) {
      res.status(400).json({ message: 'Invalid Parameters' })
      return
    }
    let key
    try {
      key = JSON.parse(req.body)
      if (!validator.checkKey(key)) {
        res.status(400).send({ message: 'Invalid Key Object' })
        return
      }
    } catch (err) {
      res.status(400).send({ message: 'Invalid JSON Body' })
      return
    }

    const kid = req.params.keyId

    if (!validator.checkKid(kid) || !validator.checkKey(key)) {
      res.status(400).send({ message: 'Invalid Parameters' })
      return
    }

    const kek = req.query.kek

    if (key.k && !key.ek) {
      if (!kek) {
        res.status(400).send({ message: 'KEK Required' })
        return
      }
      const ek = keywrap.wrapKey(key.k, kek)
      if (!ek) {
        res.status(500).send({ message: 'Internal Server Error' })
        return
      }
      key.ek = ek.toString('hex')
    }

    const keyDetail = await U.wrapPromise<T.KeyDetail>(db.putKey(kid, key))
    if (U.isError(keyDetail)) {
      if (keyDetail.message === 'Not Found') {
        res.status(404).send(keyDetail.message)
      } else {
        res.status(500).send({ message: 'Internal Server Error' })
      }
    }

    res.status(200).json(keyDetail)
  })

  app.delete('/keys/:keyIds', async (req, res) => {
    const kids = req.params.keyIds
    const kidSelector = kids.split(',')

    if (!kids || !kidSelector) {
      res.status(400).send({ message: 'Bad Request' })
      return
    }

    for (let i = 0; i < kidSelector.length; i++) {
      const kid = helper.kidFromString(kidSelector[i])
      if (!validator.checkKid(kid)) {
        res.status(400).send({ message: 'Invalid KID' })
        return
      }

      kidSelector[i] = kid
    }

    if (!kidSelector) {
      res.status(400).send({ message: 'Invalid KID' })
      return
    }

    const result = await U.wrapPromise<void>(db.deleteKeys(kids))
    if (result) {
      res.status(500).send({ message: 'Internal Server Error' })
      return
    }

    res.status(200).json(result)
  })
}

export default {
  register
}
