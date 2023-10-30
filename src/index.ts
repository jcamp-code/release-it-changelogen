import { existsSync, promises as fsp } from 'node:fs'
import {
  determineSemverChange,
  generateMarkDown,
  getGitDiff,
  loadChangelogConfig,
  parseCommits,
  type ChangelogConfig,
  type GitCommit,
  type ResolvedChangelogConfig,
} from 'changelogen'
import { resolve } from 'pathe'
import { Plugin } from 'release-it'
import semver from 'semver'

interface IContext {
  config: ResolvedChangelogConfig
  commits: GitCommit[]
  recommendedVersion: string
  recommendedIncrement: string
}

interface IVersionInfo {
  increment?: string
  isPreRelease?: boolean
  latestVersion?: string
  preReleaseId?: string
}

const prompts = {
  confirmCancel: {
    type: 'expand',
    message: (_context) => `Continue with the recommended version?`,
    default: 'yes',
    choices: () => [
      {
        key: 'y',
        name: 'Yes, continue with the recommended version',
        value: 'yes',
      },
      {
        key: 'n',
        name: 'No, select a different version',
        value: 'no',
      },
      {
        key: 'x',
        name: 'Exit the release process',
        value: 'exit',
      },
    ],
  },
  confirm: {
    type: 'confirm',
    message: (_context) => `Continue with the recommended version?`,
    default: true,
  },
}
class ChangelogenPlugin extends Plugin {
  changelogenConfig: ResolvedChangelogConfig
  markdown: string

  constructor(...args) {
    super(...args)
    this.registerPrompts(prompts)
  }

  /*
  By default, every plugin receives the options configured in options[pluginName]. For instance,
   the core npm plugin receives the options under the npm property in the configuration. Other
    plugins receive the options as they are configured in the plugins section. However, if a
     plugin requires additional options from other plugins, the getInitialOptions is useful:
  */
  getInitialOptions(options, namespace) {
    return options[namespace]
  }

  async getIncrementedVersion(options: IVersionInfo) {
    if (this.options.disableVersion === false) return null

    const { recommendedVersion } = await this.getChangelogen(options)
    this.log.preview({
      title: 'Changelogen Recommended Version',
      text: recommendedVersion,
    })

    this.continue = true

    if (!this.options.bypassConfirm)
      await this.step({
        task: (answer) => {
          // eslint-disable-next-line node/prefer-global/process
          if (answer === 'exit') process.exit(0)
          this.continue = answer === 'yes'
        },
        prompt: 'confirmCancel',
      })

    if (!this.continue) return undefined
    return recommendedVersion
  }

  async getIncrementedVersionCI(options: IVersionInfo) {
    if (!this.config.isCI) return
    const { recommendedVersion } = await this.getChangelogen(options)
    return recommendedVersion
  }

  async getChangelog(_latestVersion) {
    const { commits, config } = await this.getChangelogen()
    this.markdown = await generateMarkDown(commits, config)
    return this.markdown
  }

  async bump(version) {
    const { commits, config } = await this.getChangelogen(
      {},
      { newVersion: version },
    )
    this.changelogContent = await generateMarkDown(commits, config)
    this.changelogVersion = version
  }

  async beforeRelease() {
    const { isDryRun } = this.config
    if (isDryRun) return

    let changelogMD: string
    const output = this.changelogenConfig.output as string
    if (existsSync(output)) changelogMD = await fsp.readFile(output, 'utf8')
    else changelogMD = '# Changelog\n\n'

    const lastEntry = changelogMD.match(/^###?\s+.*$/m)

    if (lastEntry)
      changelogMD = `${
        changelogMD.slice(0, lastEntry.index) + this.markdown
      }\n\n${changelogMD.slice(lastEntry.index)}`
    else changelogMD += `\n${this.markdown}\n\n`

    await fsp.writeFile(output, changelogMD)
  }

  release() {
    //console.log('release', this.options)
  }
  afterRelease() {
    //console.log('afterRelease', this.options)
  }

  // Internal Utils

  async getChangelogen(
    versionInfo?: IVersionInfo,
    overrides?: Partial<ChangelogConfig>,
  ): Promise<IContext> {
    const cwd = resolve('')
    // process.chdir(cwd)
    const opts = Object.assign({}, this.options, overrides)

    const config = await loadChangelogConfig(cwd, opts)
    const rawCommits = await getGitDiff(config.from, config.to)
    const commits = parseCommits(rawCommits, config).filter(
      (c) =>
        config.types[c.type] &&
        !(c.type === 'chore' && c.scope === 'deps' && !c.isBreaking),
    )
    this.changelogenConfig = config

    const versions = await bumpVersion(commits, config, versionInfo)

    return {
      config,
      commits,
      recommendedIncrement: versions.increment,
      recommendedVersion: versions.newVersion,
    }
  }
}

export function bumpVersion(
  commits: GitCommit[],
  config: ChangelogConfig,
  opts: IVersionInfo = {},
) {
  let override = opts.increment
  if (override && opts.isPreRelease) override = `pre${override}`

  let increment = override || determineSemverChange(commits, config) || 'patch'

  const latestVersion = opts.latestVersion || '0.0.0'

  if (latestVersion.startsWith('0.'))
    if (increment === 'major') increment = 'minor'
    else if (increment === 'minor') increment = 'patch'

  let newVersion: string

  if (config.newVersion) {
    newVersion = config.newVersion
  } else if (opts.isPreRelease) {
    const type =
      increment && !semver.prerelease(latestVersion)
        ? `pre${increment}`
        : 'prerelease'
    newVersion = semver.inc(latestVersion, type as any, opts.preReleaseId)
  } else if (increment) {
    newVersion = semver.inc(latestVersion, increment as any, opts.preReleaseId)
  }

  // if (opts.suffix) {
  //   const suffix =
  //     typeof opts.suffix === 'string'
  //       ? `-${opts.suffix}`
  //       : `-${Math.round(Date.now() / 1000)}.${commits[0].shortHash}`
  //   newVersion = newVersion.split('-')[0] + suffix
  // }

  if (newVersion === latestVersion) return {}

  return { newVersion, increment }
}

export default ChangelogenPlugin
