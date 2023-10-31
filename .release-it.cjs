/* eslint-disable no-template-curly-in-string */
// https://github.com/release-it/release-it/blob/main/config/release-it.json
module.exports = {
  plugins: {
    './dist/index.mjs': {
      excludeAuthors: ['John Campion'],
    },
  },
  hooks: {
    'after:bump': 'pnpm build',
  },
  git: {
    commit: true,
    tag: true,
    push: true,
    requireCleanWorkingDir: false,
    tagName: 'v${version}',
    commitMessage: 'chore(release): v${version}',
    tagAnnotation: 'v${version}',
  },
  github: {
    releaseName: 'v${version}',
    release: true,
    web: true,
  },
  npm: {
    publish: true,
  },
}
