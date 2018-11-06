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

        ![project settings][https://raw.githubusercontent.com/Sitecore/Sitecore.HabitatHome.Omni/master/fitness/app/docs/img/project-settings.png]

      - Go to "Cloud Messaging" tab and retrieve "Sender ID" and put the value as 
      `REACT_APP_FIREBASE_SENDER_ID=<insert-here>`
        
        ![sender id][https://raw.githubusercontent.com/Sitecore/Sitecore.HabitatHome.Omni/master/fitness/app/docs/img/gcp-sender-id.png]

      - Scroll down to the "Web configuration" section, grab the Key pair from "Web Push certificates" and put the value here: 
      `REACT_APP_FIREBASE_MESSAGING_PUSH_KEY=<insert-here>`

          ![web push key][https://raw.githubusercontent.com/Sitecore/Sitecore.HabitatHome.Omni/master/fitness/app/docs/img/push-cert.png]

      > Please take extra care about these API keys, make sure to put appopriate security restrictions and do not commit those to source control.

1. `jss start`
  
    The app is expected to render without errors on `http://localhost:3000`.

## Want to learn more about JSS app mechanics?

Consult this [README](https://github.com/Sitecore/jss/blob/master/samples/react/README.md) for more details. This app is largely based on that boilerplate.
