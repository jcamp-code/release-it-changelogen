#!/usr/bin/env node

// src/bin/release-it-changelogen.ts
import parseArgs from "yargs-parser";

// src/cli.ts
import { $ } from "execa";
import runTasks from "release-it";

// src/log.ts
import chalk from "chalk";
var Logger = class {
  isCI;
  isVerbose;
  verbosityLevel;
  isDryRun;
  constructor({
    isCI = true,
    isVerbose = false,
    verbosityLevel = 0,
    isDryRun = false
  } = {}) {
    this.isCI = isCI;
    this.isVerbose = isVerbose;
    this.verbosityLevel = verbosityLevel;
    this.isDryRun = isDryRun;
  }
  shouldLog(isExternal) {
    return this.verbosityLevel === 2 || this.isVerbose && isExternal;
  }
  log(...args) {
    console.log(...args);
  }
  error(...args) {
    console.error(chalk.red("ERROR"), ...args);
  }
  info(...args) {
    this.log(chalk.grey(...args));
  }
  warn(...args) {
    this.log(chalk.yellow("WARNING"), ...args);
  }
};
var log_default = Logger;

// src/cli.ts
var log = new log_default();
function getVersion() {
  return $.sync`release-it -v`.stdout;
}
var helpText = `Release It! ${getVersion()}  (With Changelogen Plugin)

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

For more details, please see https://github.com/release-it/release-it`;
var version = () => log.log(getVersion());
var help = () => log.log(helpText);
var cli_default = async (options2) => {
  if (options2.version)
    version();
  else if (options2.help)
    help();
  else
    return runTasks(options2);
  return Promise.resolve();
};

// src/bin/release-it-changelogen.ts
var aliases = {
  c: "config",
  d: "dry-run",
  h: "help",
  i: "increment",
  v: "version",
  V: "verbose"
};
var parseCliArguments = (args) => {
  const options2 = parseArgs(args, {
    boolean: ["dry-run", "ci"],
    alias: aliases,
    configuration: {
      "parse-numbers": false,
      "camel-case-expansion": false
    }
  });
  if (options2.V) {
    options2.verbose = typeof options2.V === "boolean" ? options2.V : options2.V.length;
    delete options2.V;
  }
  options2.increment = options2._[0] || options2.i;
  return options2;
};
var options = parseCliArguments([].slice.call(process.argv, 2));
cli_default(options).then(
  () => process.exit(0),
  ({ code }) => process.exit(Number.isInteger(code) ? code : 1)
);
