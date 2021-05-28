# Disconnected Mode Setup

You can get the apps running (front-end only) without a Sitecore instance and run in [disconnected mode](https://jss.sitecore.com/docs/fundamentals/application-modes#disconnected-developer-mode), what is also known as "Code-First".

The apps functionalities will naturally be limited (less personalization, etc.), but it is enough to understand how the apps are put together.

The Google Maps and Firebase features will not work in disconnected mode and you will see errors in the browser console related to them. This is because the API keys are not injected in the JSS compiled bundle before it is run by your browser.

For the complete [integrated mode](https://jss.sitecore.com/docs/fundamentals/application-modes#integrated-mode) or [connected mode](https://jss.sitecore.com/docs/fundamentals/application-modes#connected-developer-mode) scenario, follow the [complete installation](installation.md) documentation.

## Pre-requisites

All the defaults are configurable. More on that later.

1. A clone of this repository.
    * The default project folder is `C:\projects\Sitecore.Demo.Headless`.
2. Sitecore JSS CLI installed globally
    * `npm install -g @sitecore-jss/sitecore-jss-cli`
3. Visual Studio 2019
    * To run the Boxever proxy project.

## Boxever

### Boxever Organization Setup

First, you must set and get some settings values in your Boxever organization.

[Setup your Boxever Organization](boxever.md).

### Apps Setup

Using the client key obtained above, update the `REACT_APP_BOXEVER_CLIENT_KEY` value in the following files:

* `\fitness\app\.env`
* `\fitness\kiosk\.env`

### Boxever Proxy

In order to get/set guest data extensions in Boxever, a proxy application must be run. It hides the Boxever API Token from the browser.

#### Disconnected Mode Boxever Proxy Setup

You must set some environment variables on your computer for the Boxever proxy to use. Create the following environment variables with these values:

* `BOXEVER_APIURL`: https://api-eu-west-1-production.boxever.com
* `BOXEVER_CLIENTKEY`: The "Client Key" you noted in the previous section.
* `BOXEVER_APITOKEN`: The "API Token" you noted in the previous section.

#### Starting the Boxever Proxy

In disconnected mode, you can manually start the .Net Core app by running the solution from Visual Studio.

1. Open the `/docker/images/demo-boxever/Sitecore.Integrations.Boxever.sln` solution in Visual Studio.
2. Run the project in Visual Studio by hitting F5.

A browser window will open where you can interact with the Boxever proxy API for testing purposes.

The Fitness app and kiosk are configured to use this Boxever proxy when they are run in disconnected mode.

## Fitness

### Fitness Setup

1. Open an elevated (run as administrator) terminal in the `\fitness\app` folder.
2. Run `npm install`

### Optional - Connecting the Fitness app to OrderCloud

1. Create your account at [https://portal.ordercloud.io/register](https://portal.ordercloud.io/register).
2. Follow the instructions [here](https://github.com/ordercloud-api/headstart/tree/development#seeding-ordercloud-data) to seed the environment.
3. Edit the `fitness\app\occonfig.json` file:
    * Set ocBuyerClientId to the Buyer App ID obtained at step 2.
    * Set ocBaseApiUrl to https://sandboxapi.ordercloud.io

    Example:

    ```json
    {
        "ocBuyerClientId": "9596A5CD-C132-44A9-A67F-97709806B192",
        "ocBaseApiUrl": "https://sandboxapi.ordercloud.io"
    }
    ```

### Running Fitness

Run `jss start`

The app is expected to render without errors on `http://localhost:3000`.

> Some API services (event favoriting, event registration, etc.) are not mocked, so it is expected to see some console errors during some flows.

### Fitness Deployment to Sitecore

Now that the Fitness app is running in disconnected mode, you might be tempted to connect and deploy to a Sitecore instance. **Don't!**

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

> Some API services are not mocked, so it is expected to see some console errors during some flows.

### Kiosk Deployment to Sitecore

Now that the Kiosk app is running in disconnected mode, you might be tempted to connect and deploy to a Sitecore instance. **Don't!**

The complete demo has many "Sitecore-First" items. Deploying the disconnected mode mocked data to Sitecore would not provide the complete experience.

To deploy the complete demo, follow the [complete installation](installation.md) documentation.
