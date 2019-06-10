// tslint:disable-next-line: interface-name
export interface Key {
  kid: string,
  k: string,
  ek: string,
  kekId: string,
}

// tslint:disable-next-line: interface-name
export interface KeyDetail extends Key {
  info: string,
  contentId: string,
  lastUpdate: Date,
  expiration: Date
}

// tslint:disable-next-line: interface-name
export interface KeyIndex {
  [key: string]: KeyDetail
}

// tslint:disable-next-line: interface-name
export interface RequestParams {
  kek: string
}