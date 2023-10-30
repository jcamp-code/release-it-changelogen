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
    push: true,
    tagName: 'v${version}',
    commitMessage: 'chore(release): v${version}',
  },
  github: {
    release: true,
  },
  npm: {
    publish: true,
  },
}
