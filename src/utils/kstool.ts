#! /usr/bin/env node

import keywrap from '../lib/keywrap'

function printUsageAndExit () {
    // tslint:disable-next-line: no-console
  console.log('kstool <command> [options]')
  process.exit(0)
}

function doWrap (args: string[]) {
  if (args.length !== 3 || args[0] !== '--kek') {
      // tslint:disable-next-line: no-console
    console.log("invalid arguments for 'wrap' command")
    process.exit(1)
  }
  const kek = args[1]
  const key = args[2]
  const wrapped = keywrap.wrapKey(key, kek)
  if (wrapped) {
    // tslint:disable-next-line: no-console
    console.log(wrapped.toString('hex'))
  }
}

function doUnwrap (args: string[]) {
  if (args.length !== 3 || args[0] !== '--kek') {
    // tslint:disable-next-line: no-console
    console.log("invalid arguments for 'unwrap' command")
    process.exit(1)
  }
  const kek = args[1]
  const ek = args[2]
  const unwrapped = keywrap.unwrapKey(ek, kek)
  if (!unwrapped) {
    // tslint:disable-next-line: no-console
    console.log('ERROR: cannot unwrap key')
    process.exit(1)
    return
  }
  // tslint:disable-next-line: no-console
  console.log(unwrapped.toString('hex'))
}

if (process.argv.length < 3) {
  printUsageAndExit()
}

const command = process.argv[2]
switch (command) {
  case 'wrap':
    doWrap(process.argv.slice(3))
    break
  case 'unwrap':
    doUnwrap(process.argv.slice(3))
    break
  default:
    // tslint:disable-next-line: no-console
    console.log('unknown command')
}
