# Integrated and Connected Modes Installation

This procedure is intended to deploy the complete Sitecore Omni demo on a Sitecore instance to work in the [integrated mode](https://jss.sitecore.com/docs/fundamentals/application-modes#integrated-mode) or [connected mode](https://jss.sitecore.com/docs/fundamentals/application-modes#connected-developer-mode). The content items for the apps are synchronized via Unicorn. For the simplified [disconnected mode](https://jss.sitecore.com/docs/fundamentals/application-modes#disconnected-developer-mode) scenario, follow the [disconnected mode setup](disconnected.md) documentation.

## Pre-requisites

All the defaults are configurable. More on that later.

1. A clone of this repository.
    * The default project folder is `C:\projects\Sitecore.Demo.Omni`.
    > In this repository, the 'master' branch is generally targeting the most recent release of Sitecore and support for older Sitecore version can be found in branches named like 'release/9.1'.
2. Sitecore 9.3.0 is installed.
    * This demo uses features of Experience Platform (XP) and also supports being deployed on XM.
    * The default website root is `C:\inetpub\wwwroot\lighthouse.dev.local`.
    * The default xConnect website root is `C:\inetpub\wwwroot\lighthouse_xconnect.dev.local`.
    > Lighthouse Fitness does not support 9.0.0 (Initial Release).
3. Sitecore JSS CLI installed globally
    * `npm install -g @sitecore-jss/sitecore-jss-cli`
4. Sitecore.JSS v13.x Server package is installed on your Sitecore instance. See [the official docs](https://jss.sitecore.com/docs/getting-started/jss-server-install) for directions.
5. Hostnames
    * The main hostname of the Sitecore instance.
      * The default is `lighthouse.dev.local`.
      * Bindings on port 80 and 443 (with a matching SSL certificate) must be present for the Sitecore IIS website.
    * A hostname for the Fitness Progressive Web App (PWA).
      * The default is `lighthousefitness.dev.local`.
      * A hosts entry must be added.
      * Bindings on port 80 and 443 (with a matching SSL certificate) must be added to the Sitecore IIS website.
    * If you want to also deploy the Kiosk application, A hostname for it.
      * The default is `lighthousefitness-kiosk.dev.local`.
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
2. Open the [`\.env`](///.env) file.
3. Set the `REACT_APP_FIREBASE_MESSAGING_SERVER_KEY` value as your Firebase server key:

    ```text
    REACT_APP_FIREBASE_MESSAGING_SERVER_KEY=YOUR-SERVER-API-KEY-HERE
    ```

4. Save the file.
5. Open the [`\docker-compose.yml`](///docker-compose.yml) file.
6. Under "services" > "automationengine" > "environment", adjust the `REACT_APP_PUBLIC_HOST_NAME` value to your Fitness application hostname:

    ```text
    services:
      ...

      automationengine:
        ...
        environment:
          ...
          REACT_APP_PUBLIC_HOST_NAME: app.${HOSTNAME_SUFFIX}
        ...
    ```

    > This host name will be used as the onclick action for the push notification and as a base url to retrieve the app icon showing next to the push notification.
7. Save the file.

### Server Deployment

1. Open an elevated (run as administrator) PowerShell window in the `\fitness\server` folder.
2. Run `.\build.ps1`

### Publishing

The JSS apps are setup to source content from the `web` database out of the box to simplify installation. This is done inside the [`\fitness\app\sitecore\config\lighthousefitness.config`](///fitness/app/sitecore/config/lighthousefitness.config) and [`\fitness\kiosk\sitecore\config\lighthousefitness-kiosk.config`](///fitness/kiosk/sitecore/config/lighthousefitness-kiosk.config) files (`database="web"`):

```xml
<site patch:before="site[@name='website']"
      name="lighthousefitness"
      ...
      database="web" />

<site patch:before="site[@name='website']"
      name="lighthousefitness-kiosk"
      ...
      database="web" />
```

> If this is changed to `master`, publishing is not required.

1. From the Launchpad, open the Desktop.
2. Open the Sitecore start menu.
3. Click the "Publish Site" item.
4. Under "Publishing", select "Smart publish".
5. Under "Publishing language", select all languages.
6. Under "Publishing targets", select all targets.
7. Hit the "Publish" button.
8. When this is done, close the "Publish Site" tool.

### XP-Only - Deploy Marketing Definitions

The new marketing definitions must be copied to the reporting database by deploying them.

1. From the Launchpad, open the "Control Panel".
2. Under Analytics, open the "Deploy marketing definitions" tool.
3. Select all the definitions.
4. Hit the "Deploy" button.
5. When it is done, close the "Deploy marketing definitions" tool.

The marketing definitions were automatically indexed in web indexes during the above publishing step. If the JSS apps content source is changed in configuration to `master`, you must rebuild marketing master indexes:

1. From the Launchpad, open the "Control Panel".
2. Under Indexing, open the "Indexing manager".
3. Select the following indexes:
    * `sitecore_marketingdefinitions_master`
    * `sitecore_marketing_asset_index_master`
4. Hit the "Rebuild" button.
5. When it is done, close the "Indexing Manager".

## Fitness

### Custom Fitness Hostname

If you have a custom Fitness app hostname, open the [`\fitness\app\sitecore\config\lighthousefitness.config`](///fitness/app/sitecore/config/lighthousefitness.config) file and edit the `hostName` value. E.g.:

```xml
<configuration>
  <sitecore>
    <sites>
      <site name="lighthousefitness"
            hostName="lighthousefitness.dev.local"
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
        2. Paste the "Key pair" as the value of the `REACT_APP_FIREBASE_MESSAGING_PUSH_KEY` entry.
        > Please take extra care about these API keys, make sure to put appopriate security restrictions and do not commit those to source control.
4. Save the file.
5. Open the [`\fitness\app\sitecore\config\lighthousefitness.config`](///fitness/app/sitecore/config/lighthousefitness.config) file.
    1. Go to the `EnvironmentVariables` section. It should look like this:
        ```xml
        <configuration>
          <sitecore>
            <javaScriptServices>
              <renderEngines>
                <renderEngine name="nodejs">
                  <instance id="defaults">
                    <EnvironmentVariables>
                      <!--
                          LIGHTHOUSE FITNESS: set the following settings as per /docs/configuration/installation.md
                      -->
                      <!--
                      <var name="REACT_APP_GOOGLE_API_KEY" value="<insert-yours-here>" />
                      <var name="REACT_APP_FIREBASE_MESSAGING_PUSH_KEY" value="<insert-yours-here>" />
                      <var name="REACT_APP_FIREBASE_SENDER_ID" value="<insert-yours-here>" />
                      -->
                    </EnvironmentVariables>
                  </instance>
                </renderEngine>
              </renderEngines>
            </javaScriptServices>
          </sitecore>
        </configuration>
        ```
    2. Remove the big `LIGHTHOUSE FITNESS` comment element.
        * Forgetting to remove the element results in an exception thrown about environment variables format when node.js is server-side rendering the pages.
    3. Uncomment the `<var />` elements inside the `<EnvironmentVariables>` element.
        ```xml
        <EnvironmentVariables>
          <var name="REACT_APP_GOOGLE_API_KEY" value="<insert-yours-here>" />
          <var name="REACT_APP_FIREBASE_MESSAGING_PUSH_KEY" value="<insert-yours-here>" />
          <var name="REACT_APP_FIREBASE_SENDER_ID" value="<insert-yours-here>" />
        </EnvironmentVariables>
        ```
    4. Replace the `<insert-yours-here>` values by the values of the `.env` file.
6. Save the file.

### Fitness Setup

1. Open an elevated (run as administrator) terminal in the `\fitness\app` folder.
2. Run `npm install`
3. Run `jss setup` and specify the following:
    1. The path to your Sitecore instance.
        * The default is `C:\inetpub\wwwroot\lighthouse.dev.local`
    2. The Sitecore hostname (URL for the layout service).
        * The default is `https://lighthousefitness.dev.local`
        * It must an HTTPS endpoint.
        * It is important not set to the default hostname of the Sitecore instance (lighthouse.dev.local).
    3. The Sitecore JSS import service URL.
        * The default is `http://lighthousefitness.dev.local/sitecore/api/jss/import`
        * It can be the HTTP endpoint to facilitate deployment.
        * Using the HTTPS endpoint requires passing an additional `--acceptCertificate` argument when calling `jss deploy` commands and is discouraged for local deployment.
    4. The Sitecore API key.
        * `{EBF6D5C1-EB80-4B15-91AB-DD3845797774}`
            > This API key is known because it is serialized and was synced to your Sitecore instance via Unicorn.
    5. The deployment secret.
        * Simply hit "enter" to generate a random one.

### Fitness Deployment

1. Run `jss deploy config`
    > This deploys the config files that live under `/fitness/app/sitecore/config`. Make sure to run this command "as administrator" to avoid permission issues. After this command execution, the Sitecore instance will recycle.
2. Run `jss deploy files`
    > Since the items were taken care by the server deployment script (via Unicorn sync 🦄), you don't have to deploy items (usually done via the `jss deploy items` CLI command).

The Fitness app is now available in [integrated mode](https://jss.sitecore.com/docs/fundamentals/application-modes#integrated-mode) at [https://lighthousefitness.dev.local](https://lighthousefitness.dev.local) or at your custom hostname.

### Run the Fitness App in Connected Mode

Now that the Fitness app has been setup, you can alternatively run it in [connected mode](https://jss.sitecore.com/docs/fundamentals/application-modes#connected-developer-mode) where the front-end assets are being served by a development web server and the data from your Sitecore instance. This is useful when making and testing changes to the front-end code.

1. Open a terminal in the `\fitness\app` folder.
2. Run `jss start:connected`

## Kiosk

### Custom Kiosk Hostname

If you have a custom Kiosk app hostname, open the [`\fitness\kiosk\sitecore\config\lighthousefitness-kiosk.config`](///fitness/kiosk/sitecore/config/lighthousefitness-kiosk.config) file and edit the `hostName` value. E.g.:

```xml
<site name="lighthousefitness-kiosk"
      hostName="lighthousefitness-kiosk.dev.local"
      ... />
```

#### XP-Only - EXM Custom Kiosk Hostname

After registration is completed on the Kiosk app, the back-end is setup to send a welcome email with the link to the Fitness mobile app, which identifies the contact on that app.
The email sending is done via Sitecore Email Experience Manager (EXM) and needs to be configured if you have a custom hostname:

1. In the Content Editor on the master database, open the `/sitecore/Content/Lighthouse Fitness Kiosk/Email` item.
2. Switch to the Content tab.
3. Change the "Base URL" field value to match your kiosk application hostname.
    * The default is `https://lighthousefitness-kiosk.dev.local`
4. Save the item.
5. Navigate to the "Publish" ribbon menu tab.
6. Click the "Publish" button to publish the item.
7. Confirm by clicking the "OK" button.
8. Close the confirmation message by clicking the "OK" button.

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
4. Open the [`\fitness\kiosk\sitecore\config\lighthousefitness-kiosk.config`](///fitness/kiosk/sitecore/config/lighthousefitness-kiosk.config) file.
    1. Go to the `EnvironmentVariables` section. It should look like this:
        ```xml
        <configuration>
          <sitecore>
            <javaScriptServices>
              <renderEngines>
                <renderEngine name="nodejs">
                  <instance id="defaults">
                    <EnvironmentVariables>
                      <!--
                          LIGHTHOUSE FITNESS KIOSK: set the following settings as per /docs/configuration/installation.md
                      -->
                      <!--
                      <var name="REACT_APP_GOOGLE_API_KEY" value="<insert-yours-here>" />
                      -->
                    </EnvironmentVariables>
                  </instance>
                </renderEngine>
              </renderEngines>
            </javaScriptServices>
          </sitecore>
        </configuration>
        ```
    2. Remove the big `LIGHTHOUSE FITNESS` comment element.
        * Forgetting to remove the element results in an exception thrown about environment variables format when node.js is server-side rendering the pages.
    3. Uncomment the `<var />` element inside the `<EnvironmentVariables>` element.
        ```xml
        <EnvironmentVariables>
          <var name="REACT_APP_GOOGLE_API_KEY" value="<insert-yours-here>" />
        </EnvironmentVariables>
        ```
    4. Replace the `<insert-yours-here>` value by the value of the `.env` file.
5. Save the file.

### Kiosk Setup

1. Open an elevated (run as administrator) terminal in the `\fitness\kiosk` folder.
2. Run `npm install`
3. Run `jss setup` and specify the following:
    1. The path to your Sitecore instance.
        * The default is `C:\inetpub\wwwroot\lighthouse.dev.local`
    2. The Sitecore hostname (URL for the layout service).
        * The default is `https://lighthousefitness-kiosk.dev.local`
        * It must an HTTPS endpoint.
        * It is important not set to the default hostname of the Sitecore instance (lighthouse.dev.local) or the Fitness app hostname (lighthousefitness.dev.local).
    3. The Sitecore JSS import service URL.
        * The default is `http://lighthousefitness-kiosk.dev.local/sitecore/api/jss/import`
        * It can be the HTTP endpoint to facilitate deployment.
        * Using the HTTPS endpoint requires passing an additional `--acceptCertificate` argument when calling `jss deploy` commands and is discouraged for local deployment.
    4. The Sitecore API key.
        * `{EBF6D5C1-EB80-4B15-91AB-DD3845797774}`
            > This API key is known because it is serialized and was synced to your Sitecore instance via Unicorn.
    5. The deployment secret.
        * Simply hit "enter" to generate a random one.

### Kiosk Deployment

1. Open an elevated (run as administrator) terminal in the `\fitness\kiosk` folder.
2. Run `jss deploy config`
    > This deploys the config files that live under `/fitness/kiosk/sitecore/config`. Make sure to run this command "as administrator" to avoid permission issues. After this command execution, the Sitecore instance will recycle.
3. Run `jss deploy files`
    > Since the items were taken care by the server deployment script (via Unicorn sync 🦄), you don't have to deploy items (usually done via the `jss deploy items` CLI command).

The Kiosk app is now available in [integrated mode](https://jss.sitecore.com/docs/fundamentals/application-modes#integrated-mode) at [https://lighthousefitness-kiosk.dev.local](https://lighthousefitness-kiosk.dev.local) or at your custom hostname.

### Run the Kiosk App in Connected Mode

Now that the Kiosk app has been setup, you can alternatively run it in [connected mode](https://jss.sitecore.com/docs/fundamentals/application-modes#connected-developer-mode) where the front-end assets are being served by a development web server and the data from your Sitecore instance. This is useful when making and testing changes to the front-end code.

1. Open a terminal in the `\fitness\kiosk` folder.
2. Run `jss start:connected`
