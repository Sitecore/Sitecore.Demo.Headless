# Habitat Fitness App

You can get the app running (front-end only) without Sitecore install and run disconnected, what is also known as "Code-First".
The app functionality will naturally be limited (no tracking, registration, event sign up, personalization, etc.), but it is enough to understand how the app is put together. This functionality is available in "Connected" mode, see full readme [here](https://github.com/Sitecore/Sitecore.HabitatHome.Omni/blob/master/README.md).

## Pre-requisites

Check the official JSS pre-requisites [here](https://jss.sitecore.com/docs/getting-started/quick-start).

## Quick start
1. `npm install -g @sitecore-jss/sitecore-jss-cli`
1. cd `/fitness/app`
1. `npm install`
1. `jss start`
  
    The app is expected to render without errors on `http://localhost:3000`.

    > Some API services (registration, data collection, event favoriting, etc.) are not mocked, so it is expected to see some console errors during Personalization and Registration wizard flows.

## Connecting 3rd party API services

In order for Google Maps to render on Event Detail screen and for push notifications, follow the steps below. 

1. [Obtain a Google API key](https://developers.google.com/maps/documentation/javascript/get-api-key).
      > Please do not forget to restrict this API key to your origins.

1. Obtain a Firebase API key:
      - Create a Firebase account.
      - Login to Firebase console.
      - Create a new project and open it.
      - Click on the "gear" icon and access "project settings":
        <img align="left"  src="https://github.com/Sitecore/Sitecore.HabitatHome.Omni/blob/master/fitness/app/docs/img/project-settings.png"/>
 
      - Go to "Cloud Messaging" tab and retrieve "Sender ID" and put the value as 
      `REACT_APP_FIREBASE_SENDER_ID=<insert-here>`
        <img align="left"  src="https://github.com/Sitecore/Sitecore.HabitatHome.Omni/blob/master/fitness/app/docs/img/gcp-sender-id.png" />
       
      - Scroll down to the "Web configuration" section, grab the Key pair from "Web Push certificates" and put the value here (generate if it doesn't exist yet): 
      `REACT_APP_FIREBASE_MESSAGING_PUSH_KEY=<insert-here>`
         <img align="left"  src="https://github.com/Sitecore/Sitecore.HabitatHome.Omni/blob/master/fitness/app/docs/img/push-cert.png"/>
   
      > Please take extra care about these API keys, make sure to put appopriate security restrictions and do not commit those to source control.

1. Create `.env` file next to `package.json` and add the following entries with your personal API keys obtained above:

    ```
    REACT_APP_GOOGLE_API_KEY=<insert-yours-here>
    REACT_APP_FIREBASE_MESSAGING_PUSH_KEY=<insert-yours-here>
    REACT_APP_FIREBASE_SENDER_ID=<insert-yours-here>
    ```
1. Run `jss start` for the changes in `.env` file to take affect.

### Code-first deployment

In this scenario, the code-first app deployment is performed without any server-side components (described in the "Complete setup" below). This process will bootstrap the content artifacts for the app in vanilla Sitecore instance.

> It is expected that some components on Home screen that are dependent on mocked APIs (event list and product list) won't work until you deploy the server-side components since the mocked APIs are not deployed.  

#### Pre-requisites
1. Sitecore 9.0.1 or higher is installed.
    > Habitat Fitness doesn't support 9.0.0 (Initial Release).

    > At this time, the *server-side* part does not support newly released Sitecore 9.1 yet, it is work in progress. That being said, you can deploy the "front-end" only part to Sitecore 9.1 using Step 2 "Deploy the app" below.

1. Your current site's "main" hostname is `habitathome.dev.local`
1. You also have a binding (w/ SSL) (and hosts entry) to `habitatfitness.dev.local`
1. Sitecore.JSS v11 Server package is installed on your target Sitecore instance.
	> Habitat Fitness _may_ work with JSS Tech Preview 4 (not officially supported) and wasn't even tried with earlier Tech Previews.

#### Steps

1. Create a new API key by follow directions in Step 2 [here](https://jss.sitecore.com/docs/getting-started/app-deployment) and copy the item ID into clipboard.

1. `jss setup` from cmd and specify the following:
	- path to your Sitecore instance
	- `https://habitatfitness.dev.local` (it is important it is not set to the default host name of the instance - habitathome.dev.local).
	-  Use the API key item ID obtained above when prompted for API key

1. Open `habitatfitness.config` file under `/sitecore/config` folder in this project directory.

1. Add the same environment variables for API keys obtained above for `.env` file under `<configuration>/<sitecore>/<javaScriptServices>/<EnvironmentVariables>/<renderEngines>/<renderingEngine>/<instance>/<EnvironmentVariables>` section of `habitatfitness.config` file:

    ```
      <var name="REACT_APP_GOOGLE_API_KEY" value="..." />
      <var name="REACT_APP_FIREBASE_MESSAGING_PUSH_KEY" value="..." />
      <var name="REACT_APP_FIREBASE_SENDER_ID" value="..." />
    ```

1. Execute `jss deploy config` from cmd.
    > This deploys the config files under `/fitness/app/sitecore/config` and will require elevated permissions depending on your target location. Make sure to run this command "as administrator" to avoid permission issues. After this command execution, the Sitecore instance will recycle.

1. Execute `jss deploy app --includeContent --includeDictionary`, which takes care of content and file deployment.

### Complete deployment with server-side

Want to get the app deployed with the server-side components? Consult the "Complete setup" section [here](https://github.com/Sitecore/Sitecore.HabitatHome.Omni/blob/master/README.md).

### Want to learn more about JSS app mechanics?

Consult this [README](https://github.com/Sitecore/jss/blob/master/samples/react/README.md) for more details. This app is largely based on that boilerplate.
