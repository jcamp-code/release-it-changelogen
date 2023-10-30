/* eslint-disable no-template-curly-in-string */
module.exports = {
  plugins: {
    './dist/index.js': {
      excludeAuthors: ['John Campion'],
    },
  },
  git: {
    commit: true,
    tag: true,
    push: false,
    tagName: 'v${version}',
    commitMessage: 'chore(release): v${version}',
  },
  github: {
    release: false,
  },
  npm: {
    publish: false,
  },
}
