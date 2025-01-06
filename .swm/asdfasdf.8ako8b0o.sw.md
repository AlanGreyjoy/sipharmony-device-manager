---
title: asdfasdf
---
<SwmSnippet path="/src/middlewares/auth.js" line="1">

---

&nbsp;

```javascript
module.exports = async (req, res, next) => {
  const apiKey = req.headers['x-auth-key']

  if (!apiKey) {
    return res.status(401).send('Unauthorized, missing token')
  }

  //todo: replace and implement your own token validation logic. This is NOT secure nor recommended.
  if (apiKey !== process.env.API_KEY) {
    return res.status(401).send({
      message: 'Unauthorized, invalid api key'
    })
  }

  next()
}

```

---

</SwmSnippet>

<SwmSnippet path="/README.md" line="5">

---

&nbsp;

```markdown
The device manager and provisioning server will borrow the concept of "Provisioning keys" from the Wazo-Platform. This will allow you to provision devices with a simple URL and a device key. The device manager will then take care of the rest 🥳

This provisioning server will not have a frontend, but will be accessible via REST API. This will allow you to build your own frontend or use Postman to interact with the server. It's recommended to incorporate this server into your own frontend or backend.

## 🤔 Why use the Sipharmony Device Manager and not the default Wazo-Platform provisioning server?

The Wazo-Platform provisioning server is great! But it's not designed to handle multiple device settings and configurations. The Sipharmony Device Manager is designed to handle multiple device settings and configurations. It's also designed to be lightweight and fast.

```

---

</SwmSnippet>

<SwmSnippet path="/src/controllers/deviceSettings.controller.js" line="1">

---

&nbsp;

```javascript
const deviceSettingsService = require('../services/devices/deviceSettings.service')
const logger = require('../utils/logger')

module.exports.getDeviceSettings = async (req, res) => {}

/**
 * Update a device setting
 * @param {*} req
 * @param {*} res
 */
module.exports.updateDeviceSettings = async (req, res) => {
  const { tenantUuid, vendor, setting, value } = req.body

  logger.info(
    `Updating device setting: ${setting} to ${value} for tenant: ${tenantUuid} and vendor: ${vendor}`
  )

  if (!['yealink'].includes(vendor)) {
    logger.error('Unsupported device vendor!')
    return res.status(400).send({ message: 'Unsupported device vendor!' })
  }

  await deviceSettingsService.updateDeviceSetting(vendor, tenantUuid, setting, value)

  res.status(204).send()
}

```

---

</SwmSnippet>

<SwmSnippet path="/src/models/DeviceKeys.js" line="4">

---

Here we define a `DeviceKeysSchema` for storing `tenantUuid` and `deviceKey`, with automatic timestamping.

```javascript
const DeviceKeysSchema = new Schema(
  {
    tenantUuid: {
      type: String,
      required: true
    },
    deviceKey: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
)
```

---

</SwmSnippet>

<SwmSnippet path="/src/models/DeviceSettings.js" line="4">

---

Here we define a <SwmToken path="/src/models/DeviceSettings.js" pos="4:2:2" line-data="const DeviceSettingsSchema = new Schema(">`DeviceSettingsSchema`</SwmToken> for storing device settings, including `tenantUuid`, `vendor`, `userId`, `deviceId`, `setting`, and `value`, with automatic timestamps.

```javascript
const DeviceSettingsSchema = new Schema(
  {
    tenantUuid: {
      type: String,
      required: true
    },
    vendor: {
      type: String,
      required: true
    },
    userId: {
      type: String,
      default: null
    },
    deviceId: {
      type: String,
      default: null
    },
    setting: {
      type: Object,
      required: true
    },
    value: {
      type: Object,
      required: true
    }
  },
  {
    timestamps: true
  }
)
```

---

</SwmSnippet>

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBc2lwaGFybW9ueS1kZXZpY2UtbWFuYWdlciUzQSUzQUFsYW5HcmV5am95" repo-name="sipharmony-device-manager"><sup>Powered by [Swimm](https://app.swimm.io/)</sup></SwmMeta>
