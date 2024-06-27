# The Sipharmony Device Manager - A simple auto-provisioning microservice

The Sipharmony Device Manager is a fast and lightweight device and provisioning server for VoIP IP phones. It is designed to be used with the Wazo-Platform.

The device manager and provisioning server will borrow the concept of "Provisioning keys" from the Wazo-Platform. This will allow you to provision devices with a simple URL and a device key. The device manager will then take care of the rest 🥳

This provisioning server will not have a frontend, but will be accessible via REST API. This will allow you to build your own frontend or use Postman to interact with the server. It's recommended to incorporate this server into your own frontend or backend.

## Features

- Provision devices with any subdomain and/or FQDN + `/provisioning/{deviceKey}` endpoint
- Device provisioning
- Device management
- Device monitoring
- Device configuration
- Device firmware upgrade
- Device backup and restore
- Device logs

## Supported Devices

- Aastra
- Algo
- Atcom
- Cisco
- Digium
- Escene
- Fanvil
- Flyingvoice
- Grandstream
- Htek
- Linksys
- Linphone
- Mitel
- Obihai
- Panasonic
- Poly
- Polycom
- Sangoma
- Snom
- Spectralink
- Swissvoice
- Telekonnectors
- Vtech
- Yealink
- Yeastar
- Zoiper

## Installation

Installation is easy! Just follow the steps below.

### Requirements

- Your wazo-platform must be installed and running.
- Local dev server, preferably using NGROK for local tunneling/testing

```bash
Coming soon
```

### ENV Variables

```bash
PORT=

## MongoDB
MONGO_SRV=

## Wazo-Platform
WAZO_HOST=
WAZO_API_CLIENT_NAME=
WAZO_API_CLIENT_PASSWORD=
dev-master-api-password=
```
