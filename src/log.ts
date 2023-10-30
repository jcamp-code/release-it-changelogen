import chalk from 'chalk'

class Logger {
  isCI: boolean
  isVerbose: boolean
  verbosityLevel: number
  isDryRun: boolean
  constructor({
    isCI = true,
    isVerbose = false,
    verbosityLevel = 0,
    isDryRun = false,
  } = {}) {
    this.isCI = isCI
    this.isVerbose = isVerbose
    this.verbosityLevel = verbosityLevel
    this.isDryRun = isDryRun
  }

  shouldLog(isExternal) {
    return this.verbosityLevel === 2 || (this.isVerbose && isExternal)
  }

  log(...args) {
    console.log(...args) // eslint-disable-line no-console
  }

  error(...args) {
    console.error(chalk.red('ERROR'), ...args)
  }

  info(...args) {
    this.log(chalk.grey(...args))
  }

  warn(...args) {
    this.log(chalk.yellow('WARNING'), ...args)
  }
}

export default Logger
