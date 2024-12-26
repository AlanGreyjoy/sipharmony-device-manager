---
title: RPS Service
---
# Introduction

This document will walk you through the implementation of the RPS (Redirection and Provisioning Service) in our system. The RPS service is responsible for managing accounts and devices related to provisioning servers, specifically for Yealink devices.

We will cover:

1. How RPS accounts are retrieved and filtered.
2. The process of adding a new RPS account.
3. Updating and deleting RPS accounts.
4. Managing devices within the RPS.

# Retrieving RPS accounts

The <SwmToken path="/src/services/rps/rps.service.js" pos="10:4:4" line-data="module.exports.getRpsAccounts = async query =&gt; {">`getRpsAccounts`</SwmToken> function is designed to retrieve RPS accounts based on specific query parameters. This is crucial for filtering accounts according to tenant or RPS type.

<SwmSnippet path="/src/services/rps/rps.service.js" line="1">

---

We start by logging the query parameters for debugging purposes.

```
const logger = require('../../utils/logger')
const RpsAccount = require('../../models/RpsAccount')
const yealinkRps = require('../provisioning/yealinkRps/yealinkRps')

/**
 * Get RPS accounts
 * @param {*} query
 * @returns
 */
module.exports.getRpsAccounts = async query => {
  logger.info('Getting RPS accounts')
  logger.debug(JSON.stringify(query))
```

---

</SwmSnippet>

<SwmSnippet path="/src/services/rps/rps.service.js" line="14">

---

Next, we construct the search parameters based on the query. This allows us to filter accounts by <SwmToken path="/src/services/rps/rps.service.js" pos="16:6:6" line-data="  if (query.tenantUuid) {">`tenantUuid`</SwmToken> and <SwmToken path="/src/services/rps/rps.service.js" pos="20:6:6" line-data="  if (query.rpsType) {">`rpsType`</SwmToken>.

```
  const searchParams = {}

  if (query.tenantUuid) {
    searchParams.tenantUuid = query.tenantUuid
  }

  if (query.rpsType) {
    searchParams.rpsType = query.rpsType
  }
```

---

</SwmSnippet>

<SwmSnippet path="/src/services/rps/rps.service.js" line="24">

---

We then log the constructed search parameters and retrieve the accounts from the database.

```
  logger.debug('Search params:')
  logger.debug(JSON.stringify(searchParams, null, 2))

  const rpsAccounts = await RpsAccount.find({
    ...searchParams
  })
```

---

</SwmSnippet>

<SwmSnippet path="/src/services/rps/rps.service.js" line="31">

---

Finally, the retrieved accounts are logged and returned.

```
  logger.debug(JSON.stringify(rpsAccounts, null, 2))

  return rpsAccounts
}
```

---

</SwmSnippet>

# Adding a new RPS account

The <SwmToken path="/src/services/rps/rps.service.js" pos="41:4:4" line-data="module.exports.addRpsAccount = async (tenantUuid, account) =&gt; {">`addRpsAccount`</SwmToken> function handles the creation of new RPS accounts. This is important for onboarding new tenants or servers.

<SwmSnippet path="/src/services/rps/rps.service.js" line="36">

---

We begin by logging the action of adding an account.

```
/**
 * Add RPS account
 * @param {*} tenantUuid
 * @param {*} account
 */
module.exports.addRpsAccount = async (tenantUuid, account) => {
  logger.info(`Adding RPS account for tenant: <${tenantUuid}>`)
```

---

</SwmSnippet>

<SwmSnippet path="/src/services/rps/rps.service.js" line="44">

---

The function checks the <SwmToken path="/src/services/rps/rps.service.js" pos="20:6:6" line-data="  if (query.rpsType) {">`rpsType`</SwmToken> of the account. Currently, it supports Yealink accounts, and logs the action accordingly.

```
  switch (account.rpsType) {
    case 'yealink':
      logger.info('Adding Yealink RPS account')
```

---

</SwmSnippet>

<SwmSnippet path="/src/services/rps/rps.service.js" line="48">

---

A new server is created for Yealink accounts, and a new <SwmToken path="/src/services/rps/rps.service.js" pos="2:2:2" line-data="const RpsAccount = require(&#39;../../models/RpsAccount&#39;)">`RpsAccount`</SwmToken> instance is initialized with the provided details.

```
      const yealinkRpsServer = await yealinkRps.createServer(account.serverName, account.url)

      const newRpsAccount = new RpsAccount({
        tenantUuid,
        rpsType: account.rpsType,
        serverName: account.serverName,
        url: account.url,
        id: yealinkRpsServer.id
      })
```

---

</SwmSnippet>

<SwmSnippet path="/src/services/rps/rps.service.js" line="58">

---

The new account is saved to the database and returned.

```
      await newRpsAccount.save()

      return newRpsAccount
```

---

</SwmSnippet>

<SwmSnippet path="/src/services/rps/rps.service.js" line="62">

---

If an unsupported <SwmToken path="/src/services/rps/rps.service.js" pos="20:6:6" line-data="  if (query.rpsType) {">`rpsType`</SwmToken> is provided, an error is thrown.

```
    default:
      throw new Error('Invalid rpsType')
  }
}
```

---

</SwmSnippet>

# Updating and deleting RPS accounts

The <SwmToken path="/src/services/rps/rps.service.js" pos="84:4:4" line-data="module.exports.updateRpsAccount = async (id, account) =&gt; {">`updateRpsAccount`</SwmToken> function updates an existing RPS account with new details. This is necessary for maintaining accurate account information.

<SwmSnippet path="/src/services/rps/rps.service.js" line="79">

---

We log the update action and the account details.

```
/**
 * Update RPS account
 * @param {*} id
 * @param {*} account
 */
module.exports.updateRpsAccount = async (id, account) => {
  logger.info(`Updating RPS account: <${id}>`)
  logger.debug(JSON.stringify(account))
```

---

</SwmSnippet>

<SwmSnippet path="/src/services/rps/rps.service.js" line="88">

---

The account is then updated in the database, and the updated account is returned.

```
  await RpsAccount.findByIdAndUpdate(id, account)

  return account
}
```

---

</SwmSnippet>

The <SwmToken path="/src/services/rps/rps.service.js" pos="97:4:4" line-data="module.exports.deleteRpsAccount = async id =&gt; {">`deleteRpsAccount`</SwmToken> function removes an RPS account. This is essential for cleaning up unused or obsolete accounts.

<SwmSnippet path="/src/services/rps/rps.service.js" line="93">

---

We log the deletion action and check if the account exists.

```
/**
 * Delete RPS account
 * @param {*} id
 */
module.exports.deleteRpsAccount = async id => {
  logger.info(`Deleting RPS account: <${id}>`)

  const rpsAccount = await RpsAccount.findById(id)

  if (!rpsAccount) {
    throw new Error('RPS account not found')
  }
```

---

</SwmSnippet>

<SwmSnippet path="/src/services/rps/rps.service.js" line="106">

---

The account is deleted from the database, and the associated server is also removed.

```
  await RpsAccount.findByIdAndDelete(id)

  await yealinkRps.deleteServer(rpsAccount.id)
```

---

</SwmSnippet>

<SwmSnippet path="/src/services/rps/rps.service.js" line="110">

---

Finally, the function returns a confirmation of the deletion.

```
  return true
}
```

---

</SwmSnippet>

# Managing devices within the RPS

The <SwmToken path="/src/services/rps/rps.service.js" pos="118:4:4" line-data="module.exports.addDeviceToRps = async (args, device) =&gt; {">`addDeviceToRps`</SwmToken> function adds a device to the RPS server. This is crucial for provisioning devices to the correct server.

<SwmSnippet path="/src/services/rps/rps.service.js" line="113">

---

We determine the vendor of the device and handle Yealink devices by creating them on the server.

```
/**
 * Add device to RPS
 * @param {*} args - { serverId }
 * @param {*} device
 */
module.exports.addDeviceToRps = async (args, device) => {
  const vendor = device.vendor

  switch (vendor) {
    case 'yealink':
      await yealinkRps.createDevice(args.serverId, device.macAddress)
      break
    default:
      throw new Error('Unsupported vendor. Cannot add device to an RPS server')
  }
}
```

---

</SwmSnippet>

<SwmSnippet path="/src/services/rps/rps.service.js" line="130">

---

The <SwmToken path="/src/services/rps/rps.service.js" pos="135:4:4" line-data="module.exports.deleteDeviceFromRps = async (args, device) =&gt; {}">`deleteDeviceFromRps`</SwmToken> function is intended to remove a device from the RPS server. However, its implementation is currently missing.

```
/**
 * Delete device from RPS
 * @param {*} args
 * @param {*} device
 */
module.exports.deleteDeviceFromRps = async (args, device) => {}
```

---

</SwmSnippet>

This concludes the walkthrough of the RPS service implementation. Each function plays a specific role in managing RPS accounts and devices, ensuring efficient provisioning and account management.

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBc2lwaGFybW9ueS1kZXZpY2UtbWFuYWdlciUzQSUzQUFsYW5HcmV5am95" repo-name="sipharmony-device-manager"><sup>Powered by [Swimm](https://app.swimm.io/)</sup></SwmMeta>
