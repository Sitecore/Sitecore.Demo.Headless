# Connected and Integrated Modes Installation

This procedure is intended to deploy the complete Sitecore Headless demo on a Sitecore instance to work in the [integrated mode](https://jss.sitecore.com/docs/fundamentals/application-modes#integrated-mode) or [connected mode](https://jss.sitecore.com/docs/fundamentals/application-modes#connected-developer-mode). The content items for the apps are synchronized via Unicorn. For the simplified [disconnected mode](https://jss.sitecore.com/docs/fundamentals/application-modes#disconnected-developer-mode) scenario, follow the [disconnected mode setup](disconnected.md) documentation.

## Clone this repository

Clone the Sitecore.Demo.Headless repository locally - defaults are configured for **`C:\Projects\Sitecore.Demo.Headless`**.

* **https**: `git clone https://github.com/Sitecore/Sitecore.Demo.Headless.git`
* **ssh**: `git clone git@github.com:Sitecore/Sitecore.Demo.Headless.git`

> In this repository, the 'main' branch is generally targeting the most recent release of Sitecore and support for older Sitecore version can be found in branches named like 'release/9.1'.

## Pre-requisites

* Windows 1809 or higher. Version 1909 is preferred.
* At least 16 Gb of memory. 32 Gb or more is preferred.
* A valid Sitecore 10 license file located at `C:\license\license.xml`
* The latest [Docker Desktop](https://hub.docker.com/editions/community/docker-ce-desktop-windows/).
* Sitecore JSS CLI installed globally
  * `npm install -g @sitecore-jss/sitecore-jss-cli`

## Preparing Docker

1. Ensure you are running Windows containers:
   1. From the Docker Desktop taskbar icon contextual menu (right click), you can toggle which daemon (Linux or Windows) the Docker CLI talks to. Select "Switch to Windows containers..." to use Windows containers.
2. Optionally, you may want set DNS servers in the Docker engine configuration. See the [Issue downloading nodejs](#Issue%20downloading%20nodejs) known issue for details and instructions.

## Preparing your environment

1. Open an elevated (as administrator) PowerShell session.
2. Navigate to your repository clone folder:
   * `cd C:\Projects\Sitecore.Demo.Headless`
3. Create certificates and initialize the environment file:
   * `.\init.ps1 -InitEnv -LicenseXmlPath C:\license\license.xml -AdminPassword b`
   * You can change the admin password and the license.xml file path to match your needs.
4. Pull the demo Docker images:
   * `docker-compose pull`
   * This will pull all of the necessary images to spin up your Sitecore environment. It will take quite some time if this is the first time you execute it.

### Boxever

#### Boxever organization setup

First, you must set and get some settings values in your Boxever organization.

[Setup your Boxever Organization](boxever.md).

#### Apps setup

1. Using the client key obtained above, update the `_boxever_settings` object `client_key` property value in the following files:
   * `\fitness\app\public\index.html`
   * `\fitness\kiosk\public\index.html`
2. Rebuild the CM, app, and kiosk Docker images by following the instructions of the [Front-end JSS applications](#front-end-jss-applications) section.
3. Come back to this point after rebuilding the Docker images.

#### Boxever proxy setup

1. Edit the [`\.env`](///.env) file at the root of the repository.
2. Configure the following variables:
   * `BOXEVER_APIURL`: https://api-eu-west-1-production.boxever.com
   * `BOXEVER_CLIENTKEY`: The "Client Key" you noted in the previous section.
   * `BOXEVER_APITOKEN`: The "API Token" you noted in the previous section.

### Optional - Connecting the apps to OrderCloud

1. Create your account at [https://portal.ordercloud.io/register](https://portal.ordercloud.io/register)
2. Follow the instructions [here](https://github.com/ordercloud-api/headstart/tree/development#seeding-ordercloud-data) to seed the environment.
3. Edit the [`\.env`](///.env) file at the root of the repository:
   * Set `OC_BUYER_CLIENT_ID` to the Buyer App ID
   * Set `OC_BASE_API_URL` to https://sandboxapi.ordercloud.io

### Optional - Configuring Google Maps

The published demo images have no Google Maps API keys. To enable Google Maps, you must configure your `.env` file, and build your own demo images.

1. Edit the [`\.env`](///.env) file at the root of the repository.
2. [Obtain a Google Maps API Key](google-maps.md).
3. In the `.env` file, paste the "API key" as the value of the `REACT_APP_GOOGLE_API_KEY` entry.
4. Save the file.

## Running the demo

### Starting the demo containers

1. Open an elevated (as administrator) PowerShell session.
2. Navigate to your repository clone folder:
   * `cd C:\Projects\Sitecore.Demo.Headless`
3. Stop the IIS service:
   * `iisreset /stop`
   * This is required each time you want to use the demo as the Traefik container is using the same port (443) as IIS.
4. Start the demo containers:
   * `docker-compose up -d`
   * This will spin up your Sitecore environment.
   * The Sitecore instance will be up and available within minutes, but not fully working until the init container jobs are completed. The init container runs scripts that:
     * Publish the master database to the web database using Sitecore Publishing Service.
     * Rebuild the link database.
     * Rebuild Sitecore indexes.
     * Warmup CM and CD pages for a fast first load.
   * Loading the Sitecore instance before the completion of the init container may cause:
     * Some Content Editor features and other admin pages relying on search indexes may not work.
5. Check the progress of the initialization by viewing the init container's logs:
   * `docker-compose logs -f init`
6. Wait about 30 minutes until the init container logs can read `No jobs are running. Monitoring stopped.`.
   * The init container has a known issue where it may stop itself before the jobs are all done. If you notice the init container has stopped before logging the `No jobs are running. Monitoring stopped.` message, restart the init container by running `docker-compose up -d` and continue monitoring its logs.

### Validating deployment

These sites are running in Sitecore JSS integrated mode.

1. Browse to [https://app.lighthouse.localhost](https://app.lighthouse.localhost)
   1. You should see the Lighthouse Fitness JSS progressive web application (PWA) and be able to browse events.
   2. If you see only one event, ensure that all the "init" container jobs are completed by checking its logs. It is likely that the indexes rebuild is not done yet.
2. Browse to [https://kiosk.lighthouse.localhost](https://kiosk.lighthouse.localhost)
   1. You should see the Lighthouse Fitness Kiosk JSS site and be able to browse events. This site is meant to be running on a tablet in a store for customers to register to events and receive an email to continue their journey in the first site.
      1. It is better viewed when the iPad emulation form factor is enabled in the browser development tools.
   2. If do not see any event, ensure that all the "init" container jobs are completed by checking its logs. It is likely that the indexes rebuild is not done yet.
3. Browse to [https://cm.lighthouse.localhost/sitecore](https://cm.lighthouse.localhost/sitecore)
   1. You should be able to login with the "superuser" user and the password provided while running the `init.ps1` script.

### Stopping the demo

If you want to stop the demo without losing your changes:

1. Run `docker-compose stop`

At this point you can start the demo again with `docker-compose start` to continue your work where you left off.

### Starting over

If you want to reset all of your changes and get a fresh intsance:

1. Run `docker-compose down`
2. Run `.\CleanDockerData.ps1`
3. Start again with `docker-compose up -d` to have a fresh installation of Sitecore with no files/items deployed!

## Building the demo

1. Open an elevated (as administrator) PowerShell session.
2. Navigate to your repository clone folder:
   * `cd C:\Projects\Sitecore.Demo.Headless`
3. Build your Docker images:
   * `docker-compose build --memory 8G --pull`
   * This command will:
     * Pull all the base images required by the dockerfiles.
       * You can remove the `--pull` switch to skip this step.
     * Build the demo images using the memory limit passed in the `--memory` argument.
       * Adjust the number based on your available free memory.
       * The format is a number followed by the letter `G` for Gb.
       * The `--memory` argument is optional.

## Development cycle

At this time, there is no easy way to update the JSS applications `/dist` folder content in the running cm, app, and kiosk containers nor the server build artifacts in the cm and cd containers. This will be added later.

### Front-end JSS applications

After you have made some changes to the JSS applications JavaScript code:

1. Open an elevated (as administrator) PowerShell session.
2. Navigate to your repository clone folder:
   * `cd C:\Projects\Sitecore.Demo.Headless`
3. Build your Docker images:
   * `docker-compose build --memory 8G cm app kiosk`
   * This command will build the cm, app, and kiosk demo images.
     * cm dockerfile will build both the app and kiosk JSS applications on a Windows container and include the `/dist` folders in the CM image for Experience Editor support.
     * app and kiosk dockerfiles will each build their respective JSS application and its node server-side rendering (SSR) proxy on Linux containers. These are building faster than the cm image.
     * You can choose to build only one, two, or all three of these images depending on the changes you have made.
   * It will build the demo images using the memory limit passed in the `--memory` argument.
     * Adjust the number based on your available free memory.
     * The format is a number followed by the letter `G` for Gb.
     * The `--memory` argument is optional.
4. Restart the containers from the newly built images:
   * `docker-compose up -d`

### Back-end server solution

After you have made some changes to the `Sitecore.Demo.Fitness` server solution projects:

1. Open an elevated (as administrator) PowerShell session.
2. Navigate to your repository clone folder:
   * `cd C:\Projects\Sitecore.Demo.Headless`
3. Build your Docker images:
   * `docker-compose build --memory 8G cm cd`
   * This command will build the cm, and cd demo images.
     * cm dockerfile will build the server solution and include it in the CM image. It will also build both the app and kiosk JSS applications on a Windows container and include the `/dist` folders in the CM image for Experience Editor support.
     * cd dockerfile will build only the server solution and include it in the CD image. It is way faster than the cm image to build. If the changes are targetting the apps outside of the Experience Editor, rebuilding only this image will be enough.
     * You can choose to build only one, or all two of these images depending on the changes you have made.
   * It will build the demo images using the memory limit passed in the `--memory` argument.
     * Adjust the number based on your available free memory.
     * The format is a number followed by the letter `G` for Gb.
     * The `--memory` argument is optional.
4. Restart the containers from the newly built images:
   * `docker-compose up -d`

## Running the JSS apps in connected mode

The JSS applications included in this repository can also be run in [connected mode](https://jss.sitecore.com/docs/fundamentals/application-modes#connected-developer-mode) where the JSS app is run in a development server but the data comes from your Sitecore instance.

You can run only one JSS application in connected mode at a time. Ensure you stop one before starting the other.

**NOTE:** The Google Maps and Firebase features will not work in connected mode and you will see errors in the browser console related to them. This is because the API keys are not injected in the JSS compiled bundle before it is run by your browser.

### Connected mode prerequisites

You have a running and functionnal demo on Docker.

### Running Lighthouse Fitness in connected mode

1. Open an elevated (as administrator) PowerShell session.
2. Navigate to your repository clone folder in the `\fitness\app` folder:
   * `cd C:\Projects\Sitecore.Demo.Headless\fitness\app`
3. Run `npm install`
4. Start the JSS application in connected mode:
   1. `jss start:connected`
5. The first time you start the JSS app in connected mode, it will ask "This command requires a Sitecore connection. Would you like to configure the connection? [y/n]:". Type `y`.
   1. `jss setup` will then run. Enter the following values to the questions:
      1. Is your Sitecore instance on this machine or accessible via network share?: Type `n`.
      2. Sitecore hostname: Enter `https://app-cd.lighthouse.localhost`
      3. Sitecore import service URL: Enter `https://cm.lighthouse.localhost/sitecore/api/jss/import`
      4. Sitecore API Key (ID of API key item): Enter `{EBF6D5C1-EB80-4B15-91AB-DD3845797774}`
      5. Please enter your deployment secret: Press enter to generate a new secret.
   2. Do not execute any of the proposed next steps.
   3. At the question "Is the config deployed?", type `y`.
6. A browser will open to `http://localhost:3000` and you will be able to use the JSS application in connected mode.

### Running Lighthouse Fitness Kiosk in connected mode

1. Open an elevated (as administrator) PowerShell session.
2. Navigate to your repository clone folder in the `\fitness\kiosk` folder:
   * `cd C:\Projects\Sitecore.Demo.Headless\fitness\kiosk`
3. Run `npm install`
4. Start the JSS application in connected mode:
   1. `jss start:connected`
5. The first time you start the JSS app in connected mode, it will ask "This command requires a Sitecore connection. Would you like to configure the connection? [y/n]:". Type `y`.
   1. `jss setup` will then run. Enter the following values to the questions:
      1. Is your Sitecore instance on this machine or accessible via network share?: Type `n`.
      2. Sitecore hostname: Enter `https://kiosk-cd.lighthouse.localhost`
      3. Sitecore import service URL: Enter `https://cm.lighthouse.localhost/sitecore/api/jss/import`
      4. Sitecore API Key (ID of API key item): Enter `{EBF6D5C1-EB80-4B15-91AB-DD3845797774}`
      5. Please enter your deployment secret: Press enter to generate a new secret.
   2. Do not execute any of the proposed next steps.
   3. At the question "Is the config deployed?", type `y`.
6. A browser will open to `http://localhost:3000` and you will be able to use the JSS application in connected mode.

## Development tips and tricks

### Optional - Switch the JSS apps to use the master database for quicker development

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

After doing this change, you must rebuild the CM and CD Docker images and run the new images in your containers. The instructions are the same as the [Back-end server solution](#back-end-server-solution) development cycle.

## Troubleshooting deployment

### unauthorized: authentication required

**Problem:**

When running `docker-compose up -d`, you get the following error:

```text
ERROR: Get https://<registryname>/<someimage>/manifests/<someimage>: unauthorized: authentication required
```

**Cause:**

This indicates you are not logged in your registry.

**Solution:**

Run `az acr login --name <registryname>` (or the equivalent `docker login`) and retry.

### Issue downloading nodejs

**Problem:**

When running `.\build-images.ps1` or `docker-compose up -d`, you get an error about downloading nodejs.

**Cause:**

On some computers, containers are unable to resolve DNS entries. This issue is described in details in the following blog post: [https://development.robinwinslow.uk/2016/06/23/fix-docker-networking-dns/](https://development.robinwinslow.uk/2016/06/23/fix-docker-networking-dns/)

**Solution:**

Ensure the Windows Docker engine has DNS servers configured:

1. From the Docker Desktop taskbar icon contextual menu (right click), choose "Settings".
2. In the left tab group, navigate to the "Docker Engine" tab.
3. In the JSON block, locate the `"dns"` key.
   1. If you do not have a `"dns"` key, add it after the existing ones. Ensure you add a comma (`,`) after the previous key/value pair.
4. Ensure the value of the `"dns"` key is set to at least `["8.8.8.8"]`.
   * You can also add your ISP DNS server as instructed by the blog post.
5. At the end, the JSON block should have at least:

   ```json
   {
     "dns": ["8.8.8.8"]
   }
   ```

6. Click the "Apply & Restart" button to restart your Windows Docker engine.
7. Retry the command that resulted in the error.
