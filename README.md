# Sitecore.Demo.Omni

This repository is used to share Sitecore JSS PWA demo assets and future "Sitecore Omni" related demo assets.

## Documentation

The setup/installation documentation is available in the [docs](docs/README.md) folder.

## Version Support

Sitecore 9.0 and newer.

## Demo Parts

### Server

To run in integrated mode, the server project is required to provide APIs and sychronize Unicorn items.

The server-side part is located under `\fitness\server`.

### Fitness

A progressive web app (PWA) that can be installed on devices. It allows people to browse events and register to them. It allows registration to the system and personalization.

The sources for the app are located under `\fitness\app`.

### Kiosk

A website meant to be displayed on a tablet in a physical sport shop. It allows shoppers to register for upcoming events with their email address. An email is then sent to them with a link to the Fitness app personalized with their kiosk registrations.

The sources for the app are located under `\fitness\kiosk`.

### App-Node-SSR

A project to demonstrate a way to server-side render an app with node.js / Express outside of a Sitecore instance.

The sources for the app are located under `\fitness\app-node-ssr`.
