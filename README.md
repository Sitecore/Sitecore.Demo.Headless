# Sitecore.Demo.Headless

This repository is used to share Sitecore Headless (Content Hub + Sitecore XM + Boxever + OrderCloud) demo and related assets.

## Documentation

The setup/installation documentation is available in the [docs](docs/README.md) folder.

## Version Support

Sitecore 10.1.

## Demo Parts

### Server

To run in integrated mode, the server project is required to provide APIs and sychronize Unicorn items.

The server-side part is located under `\fitness\server`.

### Kiosk

A website meant to be displayed on a tablet in a physical sport shop. It allows shoppers to register for upcoming events with their email address. An email is then sent to them with a link to the Fitness app personalized from their kiosk personalization actions and registrations. This is the entry point of the user journey.

The sources for the app are located under `\fitness\kiosk`.

### Fitness

A progressive web app (PWA) that can be installed on devices. It allows people to browse events, favorite them, and register to them. It allows registration to the system and personalization. It allows to browse a shop categories and products.

The sources for the app are located under `\fitness\app`.

### Node-SSR

Project to demonstrate a way to server-side render the apps with node.js / Express outside of a Sitecore instance.

The sources for the app are located under `\fitness\node-ssr`.

### Boxever Proxy

A .Net Core project that aims to protect the Boxever API key. It provides a proxy to get a guest information and get/set a guest data extensions. This project must be run from Visual Studio when running one of the JSS app in disconnected or connected mode.

The sources for the proxy are located under `\docker\images\demo-boxever`,

### Content Hub PCM to OrderCloud Integration

A .Net Core project that sends Content Hub PCM products to OrderCloud by using a mapping object.

The sources for the integration are located under `\integrations\OrderCloud`.

### Init Container

A .Net Core project that initializes the Sitecore instance just after the contaiers are started. It runs jobs like publishing to the web database, populating the solr managed schema, rebuilding the solr indexes, rebuilding the link database, and warming up the CM and the CD instances.

The sources for the init container are located under `\docker\images\demo-init`.
