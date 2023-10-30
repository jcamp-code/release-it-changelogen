# release-it-changelogen

## unjs/changelogen powered versioning and changelog generation plugin for Release It!

This plugin enables semantic versioning (semver) and changelog generation with [Release It!](https://github.com/release-it/release-it)

It is powered by [unjs/changelogen](https://github.com/unjs/changelogen)

```
npm install -D release-it-change-log
```

In [release-it](https://github.com/release-it/release-it) config:

```js
plugins: {
  'release-it-changelogen': {
    disableVersion: true
    templates: {
      commitMessage: "chore(release): v{{newVersion}}",
      tagMessage: "v{{newVersion}}",
      tagBody: "v{{newVersion}}",
    }
  }
}
```

### Configuration Options

#### `disableVersion`

Disables the recommended version provided by Changelogen

#### `bypassConfirm`

Skips the version confirmation prompt and always uses the version provided by Changelogen

#### All Other Options

Are passed to Changelogen; More information on available options can be found here: [changelogen](https://github.com/unjs/changelogen/blob/main/src/config.ts)
