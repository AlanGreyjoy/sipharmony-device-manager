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

## API Documentation

We love using Stoplight.io for our api documentation and we know you will too! You can visit the API documentation [here](https://sipharmony.stoplight.io/docs/sipharmony-device-manager)

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
- For production, the repo is setup to use PM2 for process management. You can use any process manager you like.
- For local development, you can use `npm run dev` to start the server using nodemon.

```bash
Coming soon
```

### ENV Variables

```bash
PORT=

# SIP Server Configuration
# This is the SIP server that the devices will connect to
# Please don't be silly and use and IP address. Use a FQDN or subdomain instead!
SIP_SERVER_HOST=

## MongoDB
## This is the MongoDB connection string. You can use MongoDB Atlas or a local MongoDB server. Docker Desktop also has a MongoDB image.
MONGO_SRV=

# Wazo-Platform
# This is the Wazo-Platform API information. You can get this information from the Wazo-Platform API documentation.
WAZO_HOST=
WAZO_API_CLIENT_NAME=
WAZO_API_CLIENT_PASSWORD=
dev-master-api-password=

# Yealink YMCS API
# This is the Yealink YMCS API information. You can get this information from the Yealink YMCS API documentation.
YEALINK_YMCS_ACCESS_KEY=
YEALINK_YMCS_ACCESS_KEY_SECRET=
```
