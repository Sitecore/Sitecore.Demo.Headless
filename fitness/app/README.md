# Habitat Fitness App

## Quick start

1. `npm install`
1. Create `.env` file next to `package.json` and add the following entries with real values of your personal API keys to the corrsponding services.

    ```
    REACT_APP_GOOGLE_API_KEY=<insert-yours-here>
    REACT_APP_FIREBASE_MESSAGING_PUSH_KEY=<insert-yours-here>
    REACT_APP_FIREBASE_SENDER_ID=<insert-yours-here>
    ```

    - [How to obtain a Google API key](https://developers.google.com/maps/documentation/javascript/get-api-key).
      > Please do not forget to restrict this API key to your origins.

    - How to obtain a Firebase API key:
      - Create a Firebase account.
      - Login to Firebase console.
      - Create a new project and open it.
      - Click on the "gear" icon and access "project settings":
       [[https://github.com/Sitecore/Sitecore.HabitatHome.Omni/blob/master/fitness/app/docs/img/project-settings.png]]
 
      - Go to "Cloud Messaging" tab and retrieve "Sender ID" and put the value as 
      `REACT_APP_FIREBASE_SENDER_ID=<insert-here>`
        [[https://github.com/Sitecore/Sitecore.HabitatHome.Omni/blob/master/fitness/app/docs/img/gcp-sender-id.png]]
       
      - Scroll down to the "Web configuration" section, grab the Key pair from "Web Push certificates" and put the value here (generate if it doesn't exist yet): 
      `REACT_APP_FIREBASE_MESSAGING_PUSH_KEY=<insert-here>`
        [[https://github.com/Sitecore/Sitecore.HabitatHome.Omni/blob/master/fitness/app/docs/img/push-cert.png]]
   
      > Please take extra care about these API keys, make sure to put appopriate security restrictions and do not commit those to source control.

1. `jss start`
  
    The app is expected to render without errors on `http://localhost:3000`.

## Deploying the app to your Sitecore instance

> Make sure the server components are deployed and Sitecore JSS is installed on your Sitecore instance prior to following the steps below.

1. Add the same environment variables as above to `habitatfitness.config` file under `/sitecore/config` folder in this project directory. They are listed under `<configuration>/<sitecore>/<javaScriptServices>/<EnvironmentVariables>/<renderEngines>/<renderingEngine>/<instance>/<EnvironmentVariables>`:

    ```
      <var name="REACT_APP_GOOGLE_API_KEY" value="..." />
      <var name="REACT_APP_FIREBASE_MESSAGING_PUSH_KEY" value="..." />
      <var name="REACT_APP_FIREBASE_SENDER_ID" value="..." />
    ```

1. `jss setup` from cmd and specify the following:
	- path to your Sitecore instance
	- `https://habitatfitness.dev.local` (it is important it is not set to the default host name of the instance - habitathome.dev.local).
	- `{EBF6D5C1-EB80-4B15-91AB-DD3845797774}` for the API key
	- hit "enter" when asked for the deployment secret
1. run `jss deploy config` from cmd
1. run `jss deploy files` from cmd

## Want to learn more about JSS app mechanics?

Consult this [README](https://github.com/Sitecore/jss/blob/master/samples/react/README.md) for more details. This app is largely based on that boilerplate.
