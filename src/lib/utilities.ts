export type E = NodeJS.ErrnoException
export type R<T> = Promise<E | T>
export type RE = Promise<null | E>

export function wrapPromise<T, K extends Promise<T> = Promise<T>> (promise: K): R<T> {
  return new Promise((resolve) => {
    promise.then((result: T) => {
      return resolve(result)
    }).catch((err: E) => {
      return resolve(err)
    })
  })
}

export function isError (arg: any): arg is E {
  return arg instanceof Error
}
