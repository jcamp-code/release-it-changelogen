module.exports = {
  plugins: {
    './dist/index.mjs': {
      excludeAuthors: ['John Campion'],
    },
  },
  git: {
    commit: true,
    tag: true,
    push: true,
    requireCleanWorkingDir: false,
  },
  github: {
    release: true,
  },
  npm: {
    publish: true,
  },
}
