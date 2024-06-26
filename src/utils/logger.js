const { Signale } = require('signale')

const logger = new Signale({
  types: {
    debug: {
      badge: '🐛',
      color: 'magenta',
      label: 'debug'
    },
    error: {
      badge: '🔥',
      color: 'red',
      label: 'error'
    },
    fatal: {
      badge: '💀',
      color: 'red',
      label: 'fatal'
    },
    info: {
      badge: '💡',
      color: 'blue',
      label: 'info'
    },
    trace: {
      badge: '📝',
      color: 'grey',
      label: 'trace'
    },
    warn: {
      badge: '⚠️',
      color: 'yellow',
      label: 'warn'
    }
  },
  scope: 'developer-logged',
  secrets: []
})

module.exports = logger
