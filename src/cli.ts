import { $ } from 'execa'
import runTasks from 'release-it'

import Log from './log'

const log = new Log()
function getVersion() {
  return $.sync`release-it -v`.stdout
}

const helpText = `Release It! ${getVersion()}  (With Changelogen Plugin)

  Usage: release-it <increment> [options]

  Use e.g. "release-it minor" directly as shorthand for "release-it --increment=minor".

  -c --config            Path to local configuration options [default: ".release-it.json"]
  -d --dry-run           Do not touch or write anything, but show the commands
  -h --help              Print this help
  -i --increment         Increment "major", "minor", "patch", or "pre*" version; or specify version [default: "patch"]
     --ci                No prompts, no user interaction; activated automatically in CI environments
     --only-version      Prompt only for version, no further interaction
  -v --version           Print release-it version number
     --release-version   Print version number to be released
     --changelog         Print changelog for the version to be released
  -V --verbose           Verbose output (user hooks output)
  -VV                    Extra verbose output (also internal commands output)

For more details, please see https://github.com/release-it/release-it`

/** @internal */
export const version = () => log.log(getVersion())

/** @internal */
export const help = () => log.log(helpText)

export default async (options) => {
  if (options.version) version()
  else if (options.help) help()
  else return runTasks(options)

  return Promise.resolve()
}
