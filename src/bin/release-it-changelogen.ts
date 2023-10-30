#!/usr/bin/env node
/* eslint-disable node/prefer-global/process */
import 'dotenv/config'

import parseArgs from 'yargs-parser'

import release from '../cli.js'

const aliases = {
  c: 'config',
  d: 'dry-run',
  h: 'help',
  i: 'increment',
  v: 'version',
  V: 'verbose',
}

const parseCliArguments = (args) => {
  const options = parseArgs(args, {
    boolean: ['dry-run', 'ci'],
    alias: aliases,
    configuration: {
      'parse-numbers': false,
      'camel-case-expansion': false,
    },
  })
  if (options.V) {
    options.verbose =
      typeof options.V === 'boolean' ? options.V : options.V.length
    delete options.V
  }
  options.increment = options._[0] || options.i
  return options
}

const options = parseCliArguments([].slice.call(process.argv, 2))

release(options).then(
  () => process.exit(0),
  ({ code }) => process.exit(Number.isInteger(code) ? code : 1),
)
