const router = require('express').Router({ mergeParams: true })

const routes = [
  {
    path: '/devices',
    route: require('./devices/devices.routes')
  }
]

for (const route of routes) {
  router.use(route.path, route.route)
}

module.exports = router
