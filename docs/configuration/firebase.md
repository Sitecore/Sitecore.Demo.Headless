# Obtain a Firebase Sender ID, Server Key and Key Pair

> WARNING: Please take extra care about these API keys, make sure to put appopriate security restrictions and do not commit those to source control.

1. Create a [Firebase](https://firebase.google.com/) account.
2. Login to the Firebase console.
3. Create a new project and open it.
4. In the left menu, besides "Project Overview", click on the "gear" icon then select "Project settings":
    <a href="https://github.com/Sitecore/Sitecore.Demo.Headless/blob/master/fitness/app/docs/img/project-settings.png">(Firebase Settings)<img src="https://github.com/Sitecore/Sitecore.Demo.Headless/raw/master/fitness/app/docs/img/project-settings.png"/></a>
5. Go to the "Cloud Messaging" tab.
6. If there is no "Server Key", generate it by clicking the "Add server key" button:
    <a href="https://github.com/Sitecore/Sitecore.Demo.Headless/blob/master/fitness/app/docs/img/server-key.png">(Server Key)<img align="left"  src="https://github.com/Sitecore/Sitecore.Demo.Headless/raw/master/fitness/app/docs/img/server-key.png" /></a>
7. Retrieve and note the "Server Key" token.
8. Retrieve and note the "Sender ID" value:
    <a href="https://github.com/Sitecore/Sitecore.Demo.Headless/blob/master/fitness/app/docs/img/gcp-sender-id.png">(Sender ID)<img src="https://github.com/Sitecore/Sitecore.Demo.Headless/raw/master/fitness/app/docs/img/gcp-sender-id.png" /></a>
9. Scroll down to the "Web configuration" section.
10. Under "Web Push certificates", if there is no "Key pair", generate one.
    <a href="https://github.com/Sitecore/Sitecore.Demo.Headless/blob/master/fitness/app/docs/img/push-cert.png">(Key pair)<img src="https://github.com/Sitecore/Sitecore.Demo.Headless/raw/master/fitness/app/docs/img/push-cert.png"/></a>
11. Retrieve and note the "Key pair".
12. Go to the "General" tab.
13. Under the "Your project" section:
    1. Retrieve and note the "Project ID".
    2. Retrieve and note the "Web API Key".
14. Under the "Your apps" section
    1. Create a web application.
    2. Retrieve and note the web app "App ID".
15. Enable the Firebase Installations API for your Firebase project.
    1. Open the [Firebase Installations API](https://console.cloud.google.com/apis/library/firebaseinstallations.googleapis.com) page.
    2. Click the "Enable" button.
    3. If you have more than one project, in the "Select a project" dialog, select the Firebase project you just created at step number 3.
    4. Wait to be redirected to the API overview dashboard page.
    5. Close this page.
