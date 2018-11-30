# Sitecore.HabitatHome.Omni
This repository is used to share Sitecore JSS PWA demo assets (and future “Sitecore Omni” related demo assets) Status (Public or Private)

## Assumptions
1. Sitecore 9.0.1 or higher is installed. For CM-only deployment, skip steps 1.1 and 1.2 below.
    > Habitat Fitness doesn't support 9.0.0 (Initial Release).
1. Your current site's "main" hostname is `habitathome.dev.local`
1. You also have a binding (w/ SSL) (and hosts entry) to `habitatfitness.dev.local`
1. Sitecore.JSS Server package is installed on your target Sitecore instance.
	> It is highly recommended to acquire the latest nightly build of Sitecore.JSS server for 9.0.
1. These deployment steps are not intended for the "Code-first" scenario, as the content items are expected to be deserialized via Unicorn. For the simplified Code-first scenario, please consult a separate demo scenarios document.

## Deployment

### 1. Deploy server-side components

1. cd `repo/fitness/server`
1. Open `cake-config.json` and modify it according to your environment.
	> You will likely need to update paths to `ProjectFolder`, `XConnectRoot`, and `WebsiteRoot`.
1. Run `.\build.ps1`

#### 1.1 Deploy xConnect Model to xConnect server
1. Manually copy/paste `Sitecore.HabitatHome.Fitness.Collection.Model.dll` from your the `/bin` folder of your Sitecore CM instsance to the `/bin` folder of your xConnect instance.
1. Copy `Sitecore.HabitatHome.Fitness.Collection.Model, 9.0.json` file from your repo (`Sitecore.HabitatHome.Omni\fitness\server\Sitecore.HabitatHome.Fitness.Collection.Model.Deploy\xmodels`)
to `your-xConnect-instance/Website/App_data/Models` folder.

#### 1.1 Deploy xConnect model to xConnect Indexing service
1. Copy `Sitecore.HabitatHome.Fitness.Collection.Model, 9.0.json` file from your repo (`Sitecore.HabitatHome.Omni\fitness\server\Sitecore.HabitatHome.Fitness.Collection.Model.Deploy\xmodels`)
to `your-xConnect-indexing-service/App_data/Models` folder.

##### 1.2 Deploy bits to Marketing Automation service

1. Copy the following DLLs from `fitness\server\Sitecore.HabitatHome.Fitness.Automation\bin\Debug|Release` to the Marketing Automation service's `/bin` folder:
    - `Sitecore.HabitatHome.Fitness.Automation.dll`
    - `Sitecore.HabitatHome.Fitness.Collection.Model.dll`

1. Add the following element to `sc.MarketingAutomation.ContactLoader.xml` file that can be found in `marketing-automation-service-webroot]\App_Data\Config\sitecore\MarketingAutomation` folder, under `<Settings>/ <Sitecore>/<XConnect>/<MarketingAutomation>/<Engine>/<Services>` section:
    ```xml
    <MarketingAutomation.Loading.ContactFacetsConfigurator>
      <Type>Sitecore.Xdb.MarketingAutomation.Loading.ContactFacetsConfigurator, Sitecore.Xdb.MarketingAutomation</Type>
      <As>Sitecore.Xdb.MarketingAutomation.Core.Loading.IContactExpandOptionsConfigurator, Sitecore.Xdb.MarketingAutomation.Core</As>
      <LifeTime>Singleton</LifeTime>
      <Options>
        <IncludeFacetNames>
          <Demographics>Demographics</Demographics>
          <Sports>Sports</Sports>
          <Subscriptions>Subscriptions</Subscriptions>
          <SubscriptionTokens>SubscriptionTokens</SubscriptionTokens>
          <FavoriteEvents>FavoriteEvents</FavoriteEvents>
          <RegisteredEvents>RegisteredEvents</RegisteredEvents>
          <PersonalInformation>Personal</PersonalInformation>
        </IncludeFacetNames>
      </Options>
    </MarketingAutomation.Loading.ContactFacetsConfigurator>

    ```

1. Add the following element to `sc.MarketingAutomation.ActivityTypes.xml` file that can be found in `marketing-automation-service-webroot]\App_Data\Config\sitecore\MarketingAutomation` folder, under `<Settings>/ <Sitecore>/<XConnect>/<Services>` section:
    ```xml
    <MarketingAutomation.Activity.PushNotification>
      <Type>Sitecore.Xdb.MarketingAutomation.Locator.ActivityTypeRegistration, Sitecore.Xdb.MarketingAutomation</Type>
      <LifeTime>Singleton</LifeTime>
      <Options>
        <Id>{7233ED87-BB7F-4498-8EB2-2E56896D71A7}</Id>
        <ImplementationType>Sitecore.HabitatHome.Fitness.Automation.Activities.SendPushNotification, Sitecore.HabitatHome.Fitness.Automation</ImplementationType>
      </Options>
    </MarketingAutomation.Activity.PushNotification>
    ```

1. Copy the following folder under `\fitness\server\Sitecore.HabitatHome.Fitness.Automation.Plugins\sitecore\shell\client\applications\MarketingAutomation\plugins\HabitatFitness` to `[Sitecore-CM-instance-webroot]\ Website\sitecore\shell\client\Applications\MarketingAutomation\plugins\HabitatFitness`.

1. Copy `sc.HabitatHome.Fitness.Collection.Model.xml` file from `fitness\server\Sitecore.HabitatHome.Fitness.Collection.Model.Deploy\automation` to `marketing-automation-service-webroot]\App_Data\Config\sitecore` folder. 

1. Open `sc.MarketingAutomation.HabitatFitnessServices.xml` file from `fitness\server\Sitecore.HabitatHome.Fitness.Automation\App_Data\Config\Sitecore\MarketingAutomation` folder and maket the following changes:

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

1. Copy the modified `sc.MarketingAutomation.HabitatFitnessServices.xml` file to `marketing-automation-service-webroot]\App_Data\Config\sitecore\MarketingAutomation` folder. 

### 2. Deploy the app

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
  > This deploys the config files under `/fitness/app/sitecore/config` and will require elevated permissions depending on your target location. Make sure to run this command "as administrator" to avoid permission issues. After this command execution, the Sitecore instance will recycle.

1. run `jss deploy files` from cmd
