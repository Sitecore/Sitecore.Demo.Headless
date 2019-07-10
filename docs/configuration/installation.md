# Integrated and Connected Modes Installation

This procedure is intended to deploy the complete Sitecore Omni demo on a Sitecore instance to work in the [integrated mode](https://jss.sitecore.com/docs/fundamentals/application-modes#integrated-mode) or [connected mode](https://jss.sitecore.com/docs/fundamentals/application-modes#connected-developer-mode). The content items for the apps are synchronized via Unicorn. For the simplified [disconnected mode](https://jss.sitecore.com/docs/fundamentals/application-modes#disconnected-developer-mode) scenario, follow the [disconnected mode setup](disconnected.md) documentation.

## Pre-requisites

All the defaults are configurable. More on that later.

1. A clone of this repository.
    * The default project folder is `C:\projects\Sitecore.HabitatHome.Omni`.

    > In this repository, the 'master' branch is generally targeting the most recent release of Sitecore and support for older Sitecore version can be found in branches named like 'release/9.1'.

2. Sitecore 9.1.0 or higher is installed.
    * This demo uses features of Experience Platform (XP) and also supports being deployed on XM.
    * The default website root is `C:\inetpub\wwwroot\habitathome.dev.local`.
    * The default xConnect website root is `C:\inetpub\wwwroot\habitathome_xconnect.dev.local`.

    > Habitat Fitness does not support 9.0.0 (Initial Release).

3. Sitecore JSS CLI installed globally
    * `npm install -g @sitecore-jss/sitecore-jss-cli`
4. Sitecore.JSS v11.x Server package is installed on your Sitecore instance. See [the official docs](https://jss.sitecore.com/docs/getting-started/jss-server-install) for directions.
    > Habitat Fitness _may_ work with JSS 9.0 Tech Preview 4 (not officially supported) and wasn't even tried with earlier Tech Previews.

5. Hostnames
    * The main hostname of the Sitecore instance.
      * The default is `habitathome.dev.local`.
      * Bindings on port 80 and 443 (with a matching SSL certificate) must be present for the Sitecore IIS website.
    * A hostname for the Fitness Progressive Web App (PWA).
      * The default is `habitatfitness.dev.local`.
      * A hosts entry must be added.
      * Bindings on port 80 and 443 (with a matching SSL certificate) must be added to the Sitecore IIS website.
    * If you want to also deploy the Kiosk application, A hostname for it.
      * The default is `habitatfitness-kiosk.dev.local`.
      * A hosts entry must be added.
      * Bindings on port 80 and 443 (with a matching SSL certificate) must be added to the Sitecore IIS website.

## Server

Before deploying the JSS application to Sitecore, server components must be deployed. This includes custom APIs and the JSS applications items using Unicorn synchronization as they were created in Sitecore-first mode.

### Custom Sitecore Hostname and Paths

If you have custom hostnames and/or project or website root paths, open the [`\fitness\server\cake-config.json`](///fitness/server/cake-config.json) file and edit the following values as needed.

* Custom website root (escaped `\\` folder separators)
  * WebsiteRoot
* Custom xConnect website root (escaped `\\` folder separators)
  * XConnectRoot
  * XConnectIndexerRoot
  * XConnectAutomationServiceRoot
* Custom Sitecore hostname
  * InstanceUrl
* Custom project folder (escaped `\\` folder separators)
  * ProjectFolder

> If you are deploying a Sitecore XM (CMS-only configuration), you can put values to empty folders in `XConnectRoot`, `XConnectAutomationServiceRoot`, and `XConnectIndexerRoot` settings.

### XP-Only - Optional - Configuring Marketing Automation Settings for Push Notifications

1. [Obtain a Firebase server key](firebase.md).
2. Open the [`\fitness\server\Fitness.Automation\App_Data\Config\sitecore\MarketingAutomation\sc.MarketingAutomation.HabitatFitnessServices.xml`](///fitness/server/Fitness.Automation/App_Data/Config/sitecore/MarketingAutomation/sc.MarketingAutomation.HabitatFitnessServices.xml) file.
3. Make the following changes:
    1. Replace `INSERT-SERVER-API-KEY-HERE` by the Firebase server key:

        ```xml
        <Settings>
          <Sitecore>
            <XConnect>
              <MarketingAutomation>
                <Engine>
                  <Services>
                    <HabitatFitness.EventNotificationService>
                      <Options>
                        <FirebaseMessagingApiKey>INSERT-SERVER-KEY-HERE</FirebaseMessagingApiKey>
                      </Options>
                    </HabitatFitness.EventNotificationService>
                  </Services>
                </Engine>
              </MarketingAutomation>
            </XConnect>
          </Sitecore>
        </Settings>
        ```

    2. Adjust the Fitness application hostname:

        ```xml
        <Settings>
          <Sitecore>
            <XConnect>
              <MarketingAutomation>
                <Engine>
                  <Services>
                    <HabitatFitness.EventNotificationService>
                      <Options>
                        <PublicHostName>https://app.habitathomedemo.com</PublicHostName>
                      </Options>
                    </HabitatFitness.EventNotificationService>
                  </Services>
                </Engine>
              </MarketingAutomation>
            </XConnect>
          </Sitecore>
        </Settings>
        ```

        > This host name will be used as the onclick action for the push notification and as a base url to retrieve the app icon showing next to the push notification.

### Server Deployment

1. Open an elevated (run as administrator) PowerShell window in the `\fitness\server` folder.
2. Run `.\build.ps1`

### Publishing

The JSS apps are setup to source content from the `master` database out of the box to simplify initial setup and operation in "Connected" mode. This is done inside the [`\fitness\app\sitecore\config\habitatfitness.config`](///fitness/app/sitecore/config/habitatfitness.config) and [`\fitness\kiosk\sitecore\config\habitatfitness-kiosk.config`](///fitness/kiosk/sitecore/config/habitatfitness-kiosk.config) files (`database="master"`):

```xml
<site patch:before="site[@name='website']"
      name="habitatfitness"
      ...
      database="master" />

<site patch:before="site[@name='website']"
      name="habitatfitness-kiosk"
      ...
      database="master" />
```

If this is changed to `web`, you will need to perform a site-level Smart Publishing operation. Otherwise, this is not needed.

### Rebuild Search Indexes

1. Log into Sitecore.
2. From the Launchpad, open the Control Panel.
3. Under Indexing, open the "Indexing manager".
4. Select the `sitecore_master_index` index.
    > By default, the app is configured in association with a site sourcing content from the `master` database. If this is changed in configuration to `web`, you will also need to select the `sitecore_web_index` index.
5. Hit the "Rebuild" button.

### XP-Only - Deploy Goals, Events, and Marketing Definitions

1. From the Launchpad, open the Workbox.
2. In the Workflows ribbon section, select the "Analytics Workflow" item.
    1. You should see goals and events.
3. At the bottom of the list, click "Deploy (all)".
4. Go back to Launchpad.
5. Open the "Control Panel".
6. Under Analytics, open the "Deploy marketing definitions" tool.
7. Select all the definitions.
8. Hit the "Deploy" button.
9. When it is done, close the "Deploy marketing definitions" tool.
10. Under Indexing, open the "Indexing manager".
11. Select the following indexes:
    * `sitecore_marketingdefinitions_master`
    * `sitecore_marketing_asset_index_master`

    > By default, the app is configured in association with a site sourcing content from the `master` database. If this is changed in configuration to `web`, you will also need to select the corresponding `web` indexes.

## Fitness

### Custom Fitness Hostname

If you have a custom Fitness app hostname, open the [`\fitness\app\sitecore\config\habitatfitness.config`](///fitness/app/sitecore/config/habitatfitness.config) file and edit the `hostName` value. E.g.:

```xml
<configuration>
  <sitecore>
    <sites>
      <site name="habitatfitness"
            hostName="habitatfitness.dev.local"
            ... />
    </sites>
  </sitecore>
</configuration>
```

### Optional - Connecting Fitness to 3rd Party API Services

In order for Google Maps to render on the event detail screen and for push notifications, follow the steps below.

1. Create a `.env` file next to the `\fitness\app\package.json` file with the following content:

    ```text
    REACT_APP_GOOGLE_API_KEY=
    REACT_APP_FIREBASE_MESSAGING_PUSH_KEY=
    REACT_APP_FIREBASE_SENDER_ID=
    ```

2. [Obtain a Google Maps API Key](google-maps.md).
    1. In the `.env` file, paste the API key as the value of the `REACT_APP_GOOGLE_API_KEY` entry.

3. [Obtain a Firebase sender ID and key pair](firebase.md).
    1. In the `.env` file:
        1. Paste the "Sender ID" as the value of the `REACT_APP_FIREBASE_SENDER_ID` entry.
    2. Paste "Key pair" as the value of the `REACT_APP_FIREBASE_MESSAGING_PUSH_KEY` entry.
        > Please take extra care about these API keys, make sure to put appopriate security restrictions and do not commit those to source control.

4. Save the file.
5. Open the [`\fitness\kiosk\sitecore\config\habitatfitness-kiosk.config`](///fitness/kiosk/sitecore/config/habitatfitness-kiosk.config) file.
    1. Uncomment the `<var />` elements inside the `<EnvironmentVariables>` element.

        ```xml
        <configuration>
          <sitecore>
            <javaScriptServices>
              <renderEngines>
                <renderEngine name="nodejs">
                  <instance id="defaults">
                    <EnvironmentVariables>
                      <!--
                          HABITAT FITNESS KIOSK: set the following settings as per the README.MD
                      -->
                      <var name="REACT_APP_GOOGLE_API_KEY" value="<insert-yours-here>" />
                    </EnvironmentVariables>
                  </instance>
                </renderEngine>
              </renderEngines>
            </javaScriptServices>
          </sitecore>
        </configuration>
        ```

    2. Replace the `<insert-yours-here>` values by the values  of the `.env` file.
6. Save the file.

### Fitness Setup

1. Open an elevated (run as administrator) terminal in the `\fitness\app` folder.
2. Run `npm install`
3. Run `jss setup` and specify the following:
    1. The path to your Sitecore instance.
        * The default is `C:\inetpub\wwwroot\habitathome.dev.local`
    2. The Sitecore hostname (URL for the layout service).
        * The default is `https://habitatfitness.dev.local`
        * It must an HTTPS endpoint.
        * It is important not set to the default hostname of the Sitecore instance (habitathome.dev.local).
    3. The Sitecore JSS import service URL.
        * The default is `http://habitatfitness.dev.local/sitecore/api/jss/import`
        * It can be the HTTP endpoint to facilitate deployment.
        * Using the HTTPS endpoint requires passing an additional `--acceptCertificate` argument when calling `jss deploy` commands and is discouraged for local deployment.
    4. The Sitecore API key.
        * `{EBF6D5C1-EB80-4B15-91AB-DD3845797774}`
            > This API key is known because it is serialized and was synced to your Sitecore instance via Unicorn.
    5. The deployment secret.
        * Simply hit "enter" to generate a random one.
4. Run `mkdir .\src\temp`
    * The temp folder is not under source control but required for the next steps.

### Fitness Deployment

1. Run `jss deploy config`
    > This deploys the config files that live under `/fitness/app/sitecore/config`. Make sure to run this command "as administrator" to avoid permission issues. After this command execution, the Sitecore instance will recycle.

2. Run `jss deploy files`
    > Since the items were taken care by the server deployment script (via Unicorn sync 🦄), you don't have to deploy items (usually done via the `jss deploy items` CLI command).

The Fitness app is now available in [integrated mode](https://jss.sitecore.com/docs/fundamentals/application-modes#integrated-mode) at [https://habitatfitness.dev.local](https://habitatfitness.dev.local) or at your custom hostname.

### Run the Fitness App in Connected Mode

Now that the Fitness app has been setup, you can alternatively run it in [connected mode](https://jss.sitecore.com/docs/fundamentals/application-modes#connected-developer-mode) where the front-end assets are being served by a development web server and the data from your Sitecore instance. This is useful when making and testing changes to the front-end code.

1. Open a terminal in the `\fitness\app` folder.
2. Run `jss start:connected`

## Kiosk

### Custom Kiosk Hostname

If you have a custom Kiosk app hostname, open the [`\fitness\kiosk\sitecore\config\habitatfitness-kiosk.config`](///fitness/kiosk/sitecore/config/habitatfitness-kiosk.config) file and edit the `hostName` value. E.g.:

```xml
<site name="habitatfitness-kiosk"
      hostName="habitatfitness-kiosk.dev.local"
      ... />
```

#### XP-Only - EXM Custom Kiosk Hostname

After registration is completed on the Kiosk app, the back-end is setup to send a welcome email with the link to mobile app, which identifies the contact on that app.
The email sending is done via Sitecore Email Experience Manager (EXM) and needs to be configured:

1. In the Content Editor on the master database, open the `/sitecore/Content/Habitat Fitness Kiosk/Email` item.
2. Switch to the Content tab.
3. Change the "Base URL" field value to match your kiosk application hostname.
    * The default is `https://habitatfitness-kiosk.dev.local`
4. Save the item.

### Optional - Connecting Kiosk to 3rd Party API Services

In order for Google Maps to render on the event detail screen, follow the steps below.

> If you already did it for the Fitness app, simply copy the required value from the Fitness `.env` file.

1. Create a `.env` file next to the `\fitness\kiosk\package.json` file with the following content:

    ```text
    REACT_APP_GOOGLE_API_KEY=
    ```

2. [Obtain a Google Maps API Key](google-maps.md).
    1. In the `.env` file, paste the API key as the value of the `REACT_APP_GOOGLE_API_KEY` entry.
3. Save the file.

### Kiosk Setup

1. Open an elevated (run as administrator) terminal in the `\fitness\kiosk` folder.
2. Run `npm install`
3. Run `jss setup` and specify the following:
    1. The path to your Sitecore instance.
        * The default is `C:\inetpub\wwwroot\habitathome.dev.local`
    2. The Sitecore hostname (URL for the layout service).
        * The default is `https://habitatfitness-kiosk.dev.local`
        * It must an HTTPS endpoint.
        * It is important not set to the default hostname of the Sitecore instance (habitathome.dev.local) or the Fitness app hostname (habitatfitness.dev.local).
    3. The Sitecore JSS import service URL.
        * The default is `http://habitatfitness-kiosk.dev.local/sitecore/api/jss/import`
        * It can be the HTTP endpoint to facilitate deployment.
        * Using the HTTPS endpoint requires passing an additional `--acceptCertificate` argument when calling `jss deploy` commands and is discouraged for local deployment.
    4. The Sitecore API key.
        * `{EBF6D5C1-EB80-4B15-91AB-DD3845797774}`
            > This API key is known because it is serialized and was synced to your Sitecore instance via Unicorn.
    5. The deployment secret.
        * Simply hit "enter" to generate a random one.
4. Run `mkdir .\src\temp`
    * The temp folder is not under source control but required for the next steps.

### Kiosk Deployment

1. Open an elevated (run as administrator) terminal in the `\fitness\kiosk` folder.
2. Run `jss deploy config`
    > This deploys the config files that live under `/fitness/kiosk/sitecore/config`. Make sure to run this command "as administrator" to avoid permission issues. After this command execution, the Sitecore instance will recycle.

3. Run `jss deploy files`
    > Since the items were taken care by the server deployment script (via Unicorn sync 🦄), you don't have to deploy items (usually done via the `jss deploy items` CLI command).

The Kiosk app is now available in [integrated mode](https://jss.sitecore.com/docs/fundamentals/application-modes#integrated-mode) at [https://habitatfitness-kiosk.dev.local](https://habitatfitness-kiosk.dev.local) or at your custom hostname.

### Run the Kiosk App in Connected Mode

Now that the Kiosk app has been setup, you can alternatively run it in [connected mode](https://jss.sitecore.com/docs/fundamentals/application-modes#connected-developer-mode) where the front-end assets are being served by a development web server and the data from your Sitecore instance. This is useful when making and testing changes to the front-end code.

1. Open a terminal in the `\fitness\kiosk` folder.
2. Run `jss start:connected`
