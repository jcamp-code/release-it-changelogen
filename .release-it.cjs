module.exports = {
  plugins: {
    './dist/index.mjs': {
      excludeAuthors: ['John Campion'],
    },
  },
  git: {
    commit: true,
    tag: true,
    push: false,
    // requireCleanWorkingDir: false,
  },
  github: {
    release: false,
  },
  npm: {
    publish: false,
  },
}
