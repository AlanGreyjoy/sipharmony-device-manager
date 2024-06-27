const router = require('express').Router({ mergeParams: true })

const routes = [
  {
    path: '/devices',
    route: require('./devices/devices.routes')
  },
  {
    path: '/device-keys',
    route: require('./deviceKeys/deviceKeys.routes')
  }
]

for (const route of routes) {
  router.use(route.path, route.route)
}

module.exports = router
