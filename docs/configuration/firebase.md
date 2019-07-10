# Obtain a Firebase Sender ID, Server Key and Key Pair

> WARNING: Please take extra care about these API keys, make sure to put appopriate security restrictions and do not commit those to source control.

1. Create a [Firebase](https://firebase.google.com/) account.
2. Login to the Firebase console.
3. Create a new project and open it.
4. Click on the "gear" icon and access "Project settings":
    <a href="https://github.com/Sitecore/Sitecore.HabitatHome.Omni/blob/master/fitness/app/docs/img/project-settings.png">(Firebase Settings)<img src="https://github.com/Sitecore/Sitecore.HabitatHome.Omni/raw/master/fitness/app/docs/img/project-settings.png"/></a>
5. Go to the "Cloud Messaging" tab.
6. If there is no "Server Key", generate it by clicking the "Add server key" button:
    <a href="https://github.com/Sitecore/Sitecore.HabitatHome.Omni/blob/master/fitness/app/docs/img/server-key.png">(Server Key)<img align="left"  src="https://github.com/Sitecore/Sitecore.HabitatHome.Omni/raw/master/fitness/app/docs/img/server-key.png" /></a>
7. Retrieve and note the "Server Key" token.
8. Retrieve and note the "Sender ID" value:
    <a href="https://github.com/Sitecore/Sitecore.HabitatHome.Omni/blob/master/fitness/app/docs/img/gcp-sender-id.png">(Sender ID)<img src="https://github.com/Sitecore/Sitecore.HabitatHome.Omni/raw/master/fitness/app/docs/img/gcp-sender-id.png" /></a>
9. Scroll down to the "Web configuration" section.
10. Under "Web Push certificates", if there is no "Key pair", generate one.
    <a href="https://github.com/Sitecore/Sitecore.HabitatHome.Omni/blob/master/fitness/app/docs/img/push-cert.png">(Key pair)<img src="https://github.com/Sitecore/Sitecore.HabitatHome.Omni/raw/master/fitness/app/docs/img/push-cert.png"/></a>
11. Retrieve and note the "Key pair".
