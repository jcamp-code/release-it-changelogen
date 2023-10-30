# release-it-changelogen

## unjs/changelogen powered versioning and changelog generation plugin for Release It!

This plugin adds the following with [Release It!](https://github.com/release-it/release-it)

- Enables semantic versioning (semver) and changelog generation,powered by [unjs/changelogen](https://github.com/unjs/changelogen)
- Enables [dotenv](https://github.com/motdotla/dotenv) integration automatically; no need to configure it separately

### Installation

```
npm install -D release-it-changelogen
```

In [release-it](https://github.com/release-it/release-it) config:

You also need to set git tag and commit messages to match semver. Currently, Release It plugins cannot update other plugin's options [Issue](https://github.com/release-it/release-it/issues/988)

```js
plugins: {
  'release-it-changelogen': {
    disableVersion: true
    templates: {
      commitMessage: "chore(release): v{{newVersion}}",
      tagMessage: "v{{newVersion}}",
      tagBody: "v{{newVersion}}",
    }
  },
  git: {
    tagName: 'v${version}',
    commitMessage: 'chore(release): v${version}',
    tagAnnotation: 'v${version}',
  },
}
```

### Configuration Options

#### `disableVersion`

Disables the recommended version provided by Changelogen

#### `bypassConfirm`

Skips the version confirmation prompt and always uses the version provided by Changelogen

#### All Other Options

Are passed to Changelogen; More information on available options can be found here: [changelogen](https://github.com/unjs/changelogen/blob/main/src/config.ts)
