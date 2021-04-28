# Disconnected Mode Setup

You can get the apps running (front-end only) without a Sitecore instance and run in [disconnected mode](https://jss.sitecore.com/docs/fundamentals/application-modes#disconnected-developer-mode), what is also known as "Code-First".

The apps functionalities will naturally be limited (no tracking, no personalization, no emails, no push notifications, etc.), but it is enough to understand how the apps are put together.

For the complete [integrated mode](https://jss.sitecore.com/docs/fundamentals/application-modes#integrated-mode) or [connected mode](https://jss.sitecore.com/docs/fundamentals/application-modes#connected-developer-mode) scenario, follow the [complete installation](installation.md) documentation.

## Pre-requisites

All the defaults are configurable. More on that later.

1. A clone of this repository.
    * The default project folder is `C:\projects\Sitecore.Demo.Headless`.
2. Sitecore JSS CLI installed globally
    * `npm install -g @sitecore-jss/sitecore-jss-cli`

### Optional - Connecting the apps to Google Maps

In order for Google Maps to render on the event detail screen, follow the steps below.

1. [Obtain a Google Maps API Key](google-maps.md).
2. Edit the [`\.env`](///.env) file at the root of the repository.
3. Paste the API key as the value of the `REACT_APP_GOOGLE_API_KEY` entry.
4. Save the file.

## Fitness

### Fitness Setup

1. Open an elevated (run as administrator) terminal in the `\fitness\app` folder.
2. Run `npm install`

### Starting the Boxever Proxy

In order to set/get guest data extensions in Boxever in disconnected mode, you can manually start the dotnet core app by running the solution.

1. Open the solution in Visual Studio - The solution is located in this repo at: **/docker/images/demo-boxever/Sitecore.Integrations.Boxever.sln**
2. Run the solution in Visual Studio by hitting F5
3. A browser window will open where you can interact with the Boxever proxy API for testing purposes
4. The Fitness app/kiosk is configured to use this Boxever proxy when in disconnected mode


### Running Fitness

Run `jss start`

The app is expected to render without errors on `http://localhost:3000`.

> Some API services (registration, data collection, event favoriting, etc.) are not mocked, so it is expected to see some console errors during Personalization and Registration wizard flows.

### Fitness Deployment to Sitecore

Now that the Fitness app has runs in disconnected mode, you might be tempted to connect and deploy to a Sitecore instance. **Don't!**

The complete demo has many "Sitecore-First" items. Deploying the disconnected mode mocked data to Sitecore would not provide the complete experience.

To deploy the complete demo, follow the [complete installation](installation.md) documentation.

## Kiosk

### Kiosk Setup

1. Open an elevated (run as administrator) terminal in the `\fitness\kiosk` folder.
2. Run `npm install`

### Running Kiosk

1. Make sure you stop the Fitness app.
    * Only one app can run at any time as they use the same port by default.
2. Run `jss start`

The app is expected to render without errors on `http://localhost:3000`.

> Some API services (registration, personalization, data collection, etc.) are not mocked, so it is expected to see some console errors during Personalization and Registration wizard flows.

### Kiosk Deployment to Sitecore

Now that the Kiosk app has runs in disconnected mode, you might be tempted to connect and deploy to a Sitecore instance. **Don't!**

The complete demo has many "Sitecore-First" items. Deploying the disconnected mode mocked data to Sitecore would not provide the complete experience.

To deploy the complete demo, follow the [complete installation](installation.md) documentation.
