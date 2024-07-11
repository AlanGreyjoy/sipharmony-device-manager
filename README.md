# The Sipharmony Device Manager - A simple auto-provisioning microservice

The Sipharmony Device Manager is a fast and lightweight device and provisioning server for VoIP IP phones. It is designed to be used with the Wazo-Platform. It's the same server we use for our service!

The device manager and provisioning server will borrow the concept of "Provisioning keys" from the Wazo-Platform. This will allow you to provision devices with a simple URL and a device key. The device manager will then take care of the rest 🥳

This provisioning server will not have a frontend, but will be accessible via REST API. This will allow you to build your own frontend or use Postman to interact with the server. It's recommended to incorporate this server into your own frontend or backend.

## 🤔 Why use the Sipharmony Device Manager and not the default Wazo-Platform provisioning server?

The Wazo-Platform provisioning server is great! But it's not designed to handle multiple device settings and configurations. The Sipharmony Device Manager is designed to handle multiple device settings and configurations. It's also designed to be lightweight and fast.

## 🗃️ No saved configurations on the server 🥳

The Sipharmony Device Manager will not save any device configurations on the server. This is to ensure that the server is lightweight and fast. The server will only save the device information and the device logs. This is to ensure that the server is fast and lightweight. Provisioning files are generated on the fly and streamed to the device.

## 🎂 Features

- [x] Provision devices with any subdomain and/or FQDN + `/provisioning/{deviceKey}` endpoint
- [x] Device provisioning
- [x] Device management
- [x] Device resync and reboot commands
- [ ] Device monitoring
- [x] Device configuration
- [ ] Device firmware upgrade
- [ ] Device backup and restore
- [x] Device logs

## 🍴 API Documentation

We love using Stoplight.io for our api documentation and we know you will too! You can visit the API documentation [here](https://sipharmony.stoplight.io/docs/sipharmony-device-manager)

## ☎️ Supported Devices

- [ ] Aastra
- [ ] Algo
- [ ] Atcom
- [ ] Cisco
- [ ] Digium
- [ ] Escene
- [ ] Fanvil
- [ ] Flyingvoice
- [ ] Grandstream
- [ ] Htek
- [ ] Linksys
- [ ] Linphone
- [ ] Mitel
- [ ] Obihai
- [ ] Panasonic
- [ ] Poly
- [ ] Polycom
- [ ] Sangoma
- [ ] Snom
- [ ] Spectralink
- [ ] Swissvoice
- [ ] Telekonnectors
- [ ] Vtech
- [x] Yealink
- [ ] Yeastar
- [ ] Zoiper

## 🛠️ Installation

Installation is easy! Just follow the steps below.

### Requirements

- Your wazo-platform must be installed and running.
- Local dev server, preferably using NGROK for local tunneling/testing
- For production, the repo is setup to use PM2 for process management. You can use any process manager you like.
- For local development, you can use `npm run dev` to start the server using nodemon.
- AMI access to your Asterisk server. This is required to get the device information and realtime updates.

```bash
npm i && npm run dev
```

### ENV Variables

This are the required environment variables that you need to set in your `.env` file.

```bash
PORT=

# API KEY
# This is the API key that will be used to authenticate the requests to the server
API_KEY=

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

## Asterisk AMI
## This will connect to the remote Asterisk AMI to get the device information and realtime updates
AMI_PORT=
AMI_USERNAME=
AMI_PASSWORD=
AMI_HOST=
```

### Wazo-Platform Adjustments

You will need to adjust the Wazo-Platform to use the Sipharmony Device Manager. You can do this by following the steps below.

- **Add [general-reboot] sip notify command to the Wazo-Platform**

```bash
    ...
    ;This file is found at /etc/asterisk/sip_notify.d/01-wazo.conf
    ; Generic reboot command
    [general-reboot]
    Event=>check-sync\;reboot=true
    ...
```

## Running in dev

Dev environment uses nodemon for hot reloading.

```bash
npm run dev
```

## Running in production

Production environment uses PM2 for process management. For a typical CI/CD pipeline, I would recommend using a Docker container.

```bash
npm run start
```
