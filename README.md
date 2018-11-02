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
1. run `jss deploy config` from cmd
1. run `jss deploy files` from cmd
