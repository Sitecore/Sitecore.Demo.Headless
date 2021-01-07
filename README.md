# Sitecore.Demo.Headless

This repository is used to share Sitecore JSS PWA demo assets and future "Sitecore Headless" related demo assets.

## Documentation

The setup/installation documentation is available in the [docs](docs/README.md) folder.

## Version Support

Sitecore 10.0.

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

### App-Node-SSR and Kiosk-Node-SSR

Projects to demonstrate a way to server-side render the apps with node.js / Express outside of a Sitecore instance.

The sources for the apps are located under `\fitness\app-node-ssr` and `\fitness\kiosk-node-ssr`.
