// src/index.ts
import { existsSync, promises as fsp } from "node:fs";
import {
  determineSemverChange,
  generateMarkDown,
  getGitDiff,
  loadChangelogConfig,
  parseCommits
} from "changelogen";
import { resolve } from "pathe";
import { Plugin } from "release-it";
import semver from "semver";
var prompts = {
  confirmCancel: {
    type: "expand",
    message: (_context) => `Continue with the recommended version?`,
    default: "yes",
    choices: () => [
      {
        key: "y",
        name: "Yes, continue with the recommended version",
        value: "yes"
      },
      {
        key: "n",
        name: "No, select a different version",
        value: "no"
      },
      {
        key: "x",
        name: "Exit the release process",
        value: "exit"
      }
    ]
  },
  confirm: {
    type: "confirm",
    message: (_context) => `Continue with the recommended version?`,
    default: true
  }
};
var ChangelogenPlugin = class extends Plugin {
  changelogenConfig;
  markdown;
  constructor(...args) {
    super(...args);
    this.registerPrompts(prompts);
  }
  /*
  By default, every plugin receives the options configured in options[pluginName]. For instance,
   the core npm plugin receives the options under the npm property in the configuration. Other
    plugins receive the options as they are configured in the plugins section. However, if a
     plugin requires additional options from other plugins, the getInitialOptions is useful:
  */
  getInitialOptions(options, namespace) {
    return options[namespace];
  }
  async getIncrementedVersion(options) {
    if (this.options.disableVersion === false)
      return null;
    const { recommendedVersion } = await this.getChangelogen(options);
    this.log.preview({
      title: "Changelogen Recommended Version",
      text: recommendedVersion
    });
    this.continue = true;
    if (!this.options.bypassConfirm)
      await this.step({
        task: (answer) => {
          if (answer === "exit")
            process.exit(0);
          this.continue = answer === "yes";
        },
        prompt: "confirmCancel"
      });
    if (!this.continue)
      return void 0;
    return recommendedVersion;
  }
  async getIncrementedVersionCI(options) {
    if (!this.config.isCI)
      return;
    const { recommendedVersion } = await this.getChangelogen(options);
    return recommendedVersion;
  }
  async getChangelog(_latestVersion) {
    const { commits, config } = await this.getChangelogen();
    this.markdown = await generateMarkDown(commits, config);
    return this.markdown;
  }
  async bump(version) {
    const { commits, config } = await this.getChangelogen(
      {},
      { newVersion: version }
    );
    this.changelogContent = await generateMarkDown(commits, config);
    this.changelogVersion = version;
  }
  async beforeRelease() {
    const { isDryRun } = this.config;
    if (isDryRun)
      return;
    let changelogMD;
    const output = this.changelogenConfig.output;
    if (existsSync(output))
      changelogMD = await fsp.readFile(output, "utf8");
    else
      changelogMD = "# Changelog\n\n";
    const lastEntry = changelogMD.match(/^###?\s+.*$/m);
    if (lastEntry)
      changelogMD = `${changelogMD.slice(0, lastEntry.index) + this.markdown}

${changelogMD.slice(lastEntry.index)}`;
    else
      changelogMD += `
${this.markdown}

`;
    await fsp.writeFile(output, changelogMD);
  }
  release() {
  }
  afterRelease() {
  }
  // Internal Utils
  async getChangelogen(versionInfo, overrides) {
    const cwd = resolve("");
    const opts = Object.assign({}, this.options, overrides);
    const config = await loadChangelogConfig(cwd, opts);
    const rawCommits = await getGitDiff(config.from, config.to);
    const commits = parseCommits(rawCommits, config).filter(
      (c) => config.types[c.type] && !(c.type === "chore" && c.scope === "deps" && !c.isBreaking)
    );
    this.changelogenConfig = config;
    const versions = await bumpVersion(commits, config, versionInfo);
    return {
      config,
      commits,
      recommendedIncrement: versions.increment,
      recommendedVersion: versions.newVersion
    };
  }
};
function bumpVersion(commits, config, opts = {}) {
  let override = opts.increment;
  if (override && opts.isPreRelease)
    override = `pre${override}`;
  let increment = override || determineSemverChange(commits, config) || "patch";
  const latestVersion = opts.latestVersion || "0.0.0";
  if (latestVersion.startsWith("0.")) {
    if (increment === "major")
      increment = "minor";
    else if (increment === "minor")
      increment = "patch";
  }
  let newVersion;
  if (config.newVersion) {
    newVersion = config.newVersion;
  } else if (opts.isPreRelease) {
    const type = increment && !semver.prerelease(latestVersion) ? `pre${increment}` : "prerelease";
    newVersion = semver.inc(latestVersion, type, opts.preReleaseId);
  } else if (increment) {
    newVersion = semver.inc(latestVersion, increment, opts.preReleaseId);
  }
  if (newVersion === latestVersion)
    return {};
  return { newVersion, increment };
}
var src_default = ChangelogenPlugin;
export {
  bumpVersion,
  src_default as default
};
