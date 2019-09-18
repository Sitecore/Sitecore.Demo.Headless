# Sitecore.HabitatHome.Omni Documentation

## Installation

Choose one way of running the applications:

* [Disconnected Mode](configuration/disconnected.md)
* [Integrated and Connected Modes](configuration/installation.md)

## Advanced

* [Server-Side Rendering (SSR) Outside of Sitecore Content Delivery](configuration/server-side-rendering-outside.md)

## Contributing

This demo has both Unicorn and TDS to serialize items.

* Unicorn: Used for developer setup and primary serialization solution.
* TDS: Used for Docker images. Developer's secondary serialization solution.

As a developer, you should enable and use Unicorn first.

When you are about to commit Unicorn items:

- For modified Unicorn items:
    - Sync the TDS projects from Sitecore to update the equivalent TDS items.
- For new Unicorn items:
    - In the equivalent TDS projects, add the same items.
- For deleted Unicorn items:
    - In the equivalent TDS projects, delete the same items.

## [Demo Scenarios](scenarios/readme.md)
