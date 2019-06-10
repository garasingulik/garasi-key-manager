import * as T from './types'

const isHex = (str: string): boolean => {
  for (const c in str.split('')) {
    if (!((c >= '0' && c <= '9') || (c >= 'a' && c <= 'f') || (c >= 'A' && c <= 'F'))) {
      return false
    }
  }
  return true
}

const checkKey = (key: T.KeyDetail) => {
  if (key.kid) {
    if (key.kid.indexOf('^') !== 0) {
      if (!isHex(key.kid)) return false
    }
  }
  if (key.k) {
    if (!isHex(key.k)) return false
  }
  if (key.ek) {
    if (!isHex(key.ek)) return false
  }
  return true
}

const checkKid = (kid: string) => {
  if (!isHex(kid) || kid.length !== 32) {
    return false
  }
  return true
}

const checkParameters = (params: T.RequestParams) => {
  if (params.kek) {
    if (params.kek.length !== 32) {
      return false
    }
  }

  return true
}

export default {
  checkKey,
  checkKid,
  checkParameters,
  isHex
}
