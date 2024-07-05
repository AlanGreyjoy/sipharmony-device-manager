const router = require('express').Router({ mergeParams: true })

const routes = [
  {
    path: '/devices',
    route: require('./devices/devices.routes')
  },
  {
    path: '/device-keys',
    route: require('./deviceKeys/deviceKeys.routes')
  },
  {
    path: '/device-settings',
    route: require('./deviceSettings/deviceSettings.routes')
  },
  {
    path: '/rps',
    route: require('./rps/rps.routes')
  }
]

for (const route of routes) {
  router.use(route.path, route.route)
}

module.exports = router
