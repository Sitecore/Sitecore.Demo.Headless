# Sitecore.HabitatHome.Omni
This repository is used to share Sitecore JSS PWA demo assets (and future “Sitecore Omni” related demo assets) Status (Public or Private).

## Version support
### App 
> The sources for the app are located under `/fitness/app`.
- Sitecore 9.0.x and 9.1.

### Server
> The server-side part is located under `/fitness/server`.
- Sitecore 9.0.1 or 9.0.2 only for the time being.
> Server-side support for Sitecore 9.1 is being tested at the moment. 

## Quick Start
You can get the app running (front-end only) without Sitecore install and run disconnected, what is also known as "Code-First".
The app functionality will naturally be limited (no tracking, personalization, etc.), but it is enough to understand how the app is put together.

See the directions [here](https://github.com/Sitecore/Sitecore.HabitatHome.Omni/blob/master/fitness/app/README.md).

## Complete setup

These steps are intended for the complete setup with the app and Sitecore server-side working in full Sitecore XP configuration.
The content for the app are to be deserialized via Unicorn using the PowerShell script below. For the simplified "front-end only" scenario, please see "Quick Start" above.

### Pre-requisites
1. Sitecore 9.0.1 or higher is installed.
    > Habitat Fitness doesn't support 9.0.0 (Initial Release).

    > At this time, the *server-side* part does not support newly released Sitecore 9.1 yet, it is work in progress. That being said, you can deploy the "front-end" only part to Sitecore 9.1 using Step 2 "Deploy the app" below.

1. Your current site's "main" hostname is `habitathome.dev.local`
1. You also have a binding (w/ SSL) (and hosts entry) to `habitatfitness.dev.local`
1. Sitecore.JSS v11 Server package is installed on your target Sitecore instance. See [the official docs](https://jss.sitecore.com/docs/getting-started/jss-server-install) for directions.
	> Habitat Fitness _may_ work with JSS Tech Preview 4 (not officially supported) and wasn't even tried with earlier Tech Previews.

### Deployment

#### 1. Deploy server-side components

1. cd `repo/fitness/server`
1. Open `cake-config.json` and modify it according to your environment.
	> You will likely need to update paths to `ProjectFolder`, `XConnectRoot`, `XConnectAutomationServiceRoot`, `XConnectIndexerRoot` and `WebsiteRoot`.

    > If you are deploying a Sitecore XP configuration and would like to have Marketing Automation to send push notifications, make the following changes.

    > If you are deploying a Sitecore XM (CMS-only configuration), you can put values to empty folders in `XConnectRoot`, `XConnectAutomationServiceRoot`, and `XConnectIndexerRoot` settings.

1. Run the following PowerShell script: `build.ps1`
    > If you have a Sitecore XP configuration and your Marketing Automation service is currently running, it may not allow deployment of the new DLLs during build run. You may need to stop the Sitecore Automation service before running this script.

##### 1.1. Optional - publishing

The app is setup to source content from the `master` database out of the box to simplify initial setup and operation in "Connected" mode. This is done inside the `habitatfitness.config` file (`database="master"`):
```xml
<site patch:before="site[@name='website']"
      name="habitatfitness"
      ...    
      database="master" />
```

If this is changed to `web`, you will need to perform site-level Smart Publishing operation.

##### 1.2. Rebuild search indexes
1. Log into Sitecore and open "Control Panel" from Launchpad.
1. Open "Indexing manager" tool.
1. Toggle `sitecore_master_index` index.
    > By default, the app is configured in association with a site sourcing content from `master` database. If this is changed in configuration to `web`, you will need to also rebuild the `sitecore_web_index` index.
1. Hit the "Rebuild" button.

##### 1.3. XP-only post-deployment
1. Log into Sitecore and open "Control Panel" from Launchpad.
1. Open "Deploy marketing definitions" tool.
1. Toggle all definitions.
1. Hit the "Deploy" button.

#### 2. Deploy the app to Sitecore instance

1. cd `/fitness/app`
1. `npm install` from cmd
1. `jss setup` from cmd and specify the following:
	- path to your Sitecore instance
	- `https://habitatfitness.dev.local` (it is important it is not set to the default host name of the instance - habitathome.dev.local).
	- `{EBF6D5C1-EB80-4B15-91AB-DD3845797774}` for the API key
      > This API key is known because it is serialized and will be synced to your Sitecore instance via Unicorn.
	- hit "enter" when asked for the deployment secret

1. Setup API keys for the 3rd party services if you haven't done it already as a part of [Quick start](https://github.com/Sitecore/Sitecore.HabitatHome.Omni/blob/master/fitness/app/README.md#connecting-3rd-party-api-services).

1. Open `habitatfitness.config` file under `/sitecore/config` folder in this project directory.

1. Add the same environment variables for API keys obtained for `.env` (see [Quick start](https://github.com/Sitecore/Sitecore.HabitatHome.Omni/blob/master/fitness/app/README.md)) file under `<configuration>/<sitecore>/<javaScriptServices>/<EnvironmentVariables>/<renderEngines>/<renderingEngine>/<instance>/<EnvironmentVariables>` section of `habitatfitness.config` file:

    ```
      <var name="REACT_APP_GOOGLE_API_KEY" value="..." />
      <var name="REACT_APP_FIREBASE_MESSAGING_PUSH_KEY" value="..." />
      <var name="REACT_APP_FIREBASE_SENDER_ID" value="..." />
    ```

1. Execute `jss deploy config` from cmd.
    > This deploys the config files under `/fitness/app/sitecore/config` and will require elevated permissions depending on your target location. Make sure to run this command "as administrator" to avoid permission issues. After this command execution, the Sitecore instance will recycle.

1. Execute `jss deploy files` from cmd.
    > Since the items were taken care by the server deployment script (via Unicorn sync 🦄), you don't have to deploy items (done via `jss deploy items` CLI command).

#### 3. Run app in connected mode

Run `jss start:connected` from cmd.

> Learn more about Connected mode [here](https://jss.sitecore.com/docs/fundamentals/application-modes#connected-developer-mode).

## Advanced setup

### 1. Configuring Marketing Automation settings for push notifications.

> You have to make this change prior to running `build.ps1`.

1. Open `sc.MarketingAutomation.HabitatFitnessServices.xml` file under `fitness\server\Sitecore.HabitatHome.Fitness.Automation\App_Data\Config\Sitecore\MarketingAutomation` folder and make the following changes:

    - Add Firebase Server API Key:
      ```xml
      <FirebaseMessagingApiKey>INSERT-SERVER-API-KEY-HERE</FirebaseMessagingApiKey>
      ```
        How to obtain the Firebase Server key:
      - Create a Firebase account.
      - Login to Firebase console.
      - Create a new project and open it.
      - Click on the "gear" icon and access "project settings":
       [[https://github.com/Sitecore/Sitecore.HabitatHome.Omni/blob/master/fitness/app/docs/img/project-settings.png]]
 
      - Go to "Cloud Messaging" tab and copy the "Server key" value (create it if it doesn't exist):
      [[https://github.com/Sitecore/Sitecore.HabitatHome.Omni/blob/master/fitness/app/docs/img/server-key.png]]


    - If you also deploying the app to a separate host, adjust the following setting as well:

      ```xml
      <PublicHostName>https://app.habitathomedemo.com</PublicHostName>
      ```

      > This host name will be used as onclick action for the push notification and as a base url to retrieve app icon showin next to the push notification. 
