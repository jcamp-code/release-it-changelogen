/* eslint-disable no-template-curly-in-string */
module.exports = {
  plugins: {
    'release-it-changelogen': {
      excludeAuthors: ['John Campion'],
    },
  },
  git: {
    commit: false,
    tag: false,
    requireCleanWorkingDir: false,
    push: false,
    tagName: 'v${version}',
    commitMessage: 'chore(release): v${version}',
  },
  github: {
    release: false,
  },
  npm: {
    publish: true,
  },
}
