# Sitecore.HabitatHome.Omni
This repository is used to share Sitecore JSS PWA demo assets (and future “Sitecore Omni” related demo assets) Status (Public or Private)

## Assumptions
1. Your current site's "main" hostname is `habitathome.dev.local`
1. You also have a binding (w/ SSL) (and hosts entry) to `habitatfitness.dev.local`
1. Sitecore.JSS Server package is installed on your target Sitecore instance.
	> It is highly recommended to acquire the latest nightly build of Sitecore.JSS server for 9.0.

### Deployment

#### 1. Deploy server-side components

1. cd `repo/fitness/server`
1. Open `cake-config.json` and modify it according to your environment.
	> You will likely need to update `ProjectFolder` and maybe even `XConnectRoot` and `WebsiteRoot`.
	
1. Open the `Sitecore.HabitatHome.Fitness.Collection.config` file located under `Sitecore.HabitatHome.Omni\fitness\server\Sitecore.HabitatHome.Fitness.Collection\App_Config\Include\Sitecore.HabitatHome.Fitness` folder and set the value of the `HabitatFitness.FirebaseMessagingApiKey` setting to Firebase Server key.

    - How to obtain the Firebase Server key:
      - Create a Firebase account.
      - Login to Firebase console.
      - Create a new project and open it.
      - Click on the "gear" icon and access "project settings":
       [[https://github.com/Sitecore/Sitecore.HabitatHome.Omni/blob/master/fitness/app/docs/img/project-settings.png]]
 
      - Go to "Cloud Messaging" tab and copy the "Server key" value (create it if it doesn't exist):
      [[https://github.com/Sitecore/Sitecore.HabitatHome.Omni/blob/master/fitness/app/docs/img/server-key.png]]

	
1. If you know where you are going to be hosting your web app, open the `Sitecore.HabitatHome.Fitness.Collection.config` file located under `Sitecore.HabitatHome.Omni\fitness\server\Sitecore.HabitatHome.Fitness.Collection\App_Config\Include\Sitecore.HabitatHome.Fitness` folder and set the value of the `HabitatFitness.PublicHostName` setting to the public facing host name.

    > Leave it as (`http://localhost:3000`) if you are not sure yet.
    > This setting will control the target url of the push notifications.

1. Run `.\build.ps1`
1. Manually copy/paste `Sitecore.HabitatHome.Fitness.Collection.Model.dll` from your the `/bin` folder of your
Sitecore CM instsance to the `/bin` folder of your xConnect instance.
1. Copy `Sitecore.HabitatHome.Fitness.Collection.Model, 9.0.json` file from your repo (`Sitecore.HabitatHome.Omni\fitness\server\Sitecore.HabitatHome.Fitness.Collection.Model.Deploy\xmodels`)
to `your-xConnect-instance/Website/App_data/Models` folder.
    
#### 2. Deploy the app

1. cd `/fitness/app`
1. `npm install` from cmd
1. `jss setup` from cmd and specify the following:
	- path to your Sitecore instance
	- `https://habitatfitness.dev.local` (it is important it is not set to the default host name of the instance - habitathome.dev.local).
	- `{EBF6D5C1-EB80-4B15-91AB-DD3845797774}` for the API key
	- hit "enter" when asked for the deployment secret

1. Add the same environment variables as above to `habitatfitness.config` file under `/sitecore/config` folder in this project directory. They are listed under `<configuration>/<sitecore>/<javaScriptServices>/<EnvironmentVariables>/<renderEngines>/<renderingEngine>/<instance>/<EnvironmentVariables>`:

    ```
      <var name="REACT_APP_GOOGLE_API_KEY" value="..." />
      <var name="REACT_APP_FIREBASE_MESSAGING_PUSH_KEY" value="..." />
      <var name="REACT_APP_FIREBASE_SENDER_ID" value="..." />
    ```

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

1. run `jss deploy config` from cmd
1. run `jss deploy files` from cmd
