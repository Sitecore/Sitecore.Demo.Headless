#addin nuget:?package=Cake.XdtTransform&version=0.18.1&loaddependencies=true
#addin nuget:?package=Cake.Powershell&version=0.4.8
#addin nuget:?package=Cake.Http&version=0.7.0
#addin nuget:?package=Cake.Json&version=4.0.0
#addin nuget:?package=Newtonsoft.Json&version=11.0.2
#addin nuget:?package=Cake.Incubator&version=5.1.0
#addin nuget:?package=Cake.Services&version=0.3.5

#load "local:?path=CakeScripts/helper-methods.cake"

var target = Argument<string>("Target", "Default");
var configuration = new Configuration();
var cakeConsole = new CakeConsole();
var configJsonFile = "cake-config.json";
var unicornSyncScript = $"./scripts/Unicorn/Sync.ps1";

/*===============================================
================ MAIN TASKS =====================
===============================================*/

Setup(context =>
{
	cakeConsole.ForegroundColor = ConsoleColor.Yellow;
	PrintHeader(ConsoleColor.DarkGreen);

	var configFile = new FilePath(configJsonFile);
	configuration = DeserializeJsonFromFile<Configuration>(configFile);
});

private string GetXconnectServiceName()
{
	var connectionStringFile = new FilePath($"{configuration.WebsiteRoot}/App_config/ConnectionStrings.config");
	var xPath = "connectionStrings/add[@name='xconnect.collection']/@connectionString";
	string xConnectUrl = XmlPeek(connectionStringFile, xPath);
	var uri = new Uri(xConnectUrl);
	return uri.Host + "-MarketingAutomationService";
}

Task("Default")
.WithCriteria(configuration != null)
.IsDependentOn("Copy-Sitecore-Lib")
.IsDependentOn("Modify-PublishSettings")
.IsDependentOn("Publish-All-Projects")
.IsDependentOn("Apply-Xml-Transform")
.IsDependentOn("Modify-Kiosk-Variable")
.IsDependentOn("Modify-ContentHub-Variable")
.IsDependentOn("Modify-Unicorn-Source-Folder")
.IsDependentOn("Post-Deploy");

Task("Post-Deploy")
.IsDependentOn("Sync-Unicorn");

Task("Quick-Deploy")
.WithCriteria(configuration != null)
.IsDependentOn("Copy-Sitecore-Lib")
.IsDependentOn("Modify-PublishSettings")
.IsDependentOn("Publish-All-Projects")
.IsDependentOn("Apply-Xml-Transform")
.IsDependentOn("Modify-Kiosk-Variable")
.IsDependentOn("Modify-ContentHub-Variable")
.IsDependentOn("Modify-Unicorn-Source-Folder");

/*===============================================
================= SUB TASKS =====================
===============================================*/

Task("Copy-Sitecore-Lib")
.WithCriteria(()=>(configuration.BuildConfiguration == "Local"))
.Does(()=> {
	var files = GetFiles(
		$"{configuration.WebsiteRoot}/bin/Sitecore*.dll");
	var destination = "./sc.lib";
	EnsureDirectoryExists(destination);
	CopyFiles(files, destination);
});

Task("Publish-All-Projects")
.IsDependentOn("Build-Solution")
.IsDependentOn("Stop-XConnect-Service")
.IsDependentOn("Publish-Projects")
.IsDependentOn("Publish-XConnect")
.IsDependentOn("Start-XConnect-Service");

Task("Build-Solution").Does(() => {
	MSBuild(configuration.SolutionFile, cfg => InitializeMSBuildSettings(cfg));
});

Task("Publish-Projects").Does(() => {
	var layers = new string[] { configuration.FoundationSrcFolder, configuration.FeatureSrcFolder, configuration.ProjectSrcFolder};
	foreach (var layer in layers){
		PublishProjects(layer, configuration.WebsiteRoot);
	}
});

Task("Stop-XConnect-Service").Does(()=>{
	StopService(GetXconnectServiceName());
});

Task("Start-XConnect-Service").Does(()=>{
	StartService(GetXconnectServiceName());
});

Task("Publish-XConnect").Does(()=>{
	// Files required in this area are packaged / moved to the \temp folder in the Project.AppItems Post-Build events
	CopyDirectory(
		$"{configuration.ProjectFolder}\\temp\\xConnectRoot",
		$"{configuration.XConnectRoot}"
	);
	CopyDirectory(
		$"{configuration.ProjectFolder}\\temp\\xConnectIndexerRoot",
		$"{configuration.XConnectIndexerRoot}"
	);
	CopyDirectory(
		$"{configuration.ProjectFolder}\\temp\\xConnectAutomationServiceRoot",
		$"{configuration.XConnectAutomationServiceRoot}"
	);
});

Task("Modify-Unicorn-Source-Folder").Does(() => {
	var zzzDevSettingsFile = File($"{configuration.WebsiteRoot}/App_config/Include/Project/Project.Unicorn.DevSettings.config");

	var rootXPath = "configuration/sitecore/sc.variable[@name='{0}']/@value";
	var sourceFolderXPath = string.Format(rootXPath, "fitnessSourceFolder");
	var directoryPath = MakeAbsolute(new DirectoryPath(configuration.SourceFolder)).FullPath;

	var xmlSetting = new XmlPokeSettings {
		Namespaces = new Dictionary<string, string> {
			{"patch", @"http://www.sitecore.net/xmlconfig/"}
		}
	};
	XmlPoke(zzzDevSettingsFile, sourceFolderXPath, directoryPath, xmlSetting);
});

Task("Turn-On-Unicorn").Does(() => {
	var webConfigFile = File($"{configuration.WebsiteRoot}/web.config");
	var xmlSetting = new XmlPokeSettings {
		Namespaces = new Dictionary<string, string> {
			{"patch", @"http://www.sitecore.net/xmlconfig/"}
		}
	};

	var unicornAppSettingXPath = "configuration/appSettings/add[@key='unicorn:define']/@value";
	XmlPoke(webConfigFile, unicornAppSettingXPath, "On", xmlSetting);
});

Task("Modify-PublishSettings").Does(() => {
	var publishSettingsOriginal = File($"{configuration.ProjectFolder}/publishsettings.targets");
	var destination = $"{configuration.ProjectFolder}/publishsettings.targets.user";

	CopyFile(publishSettingsOriginal,destination);

	var importXPath = "/ns:Project/ns:Import";

	var publishUrlPath = "/ns:Project/ns:PropertyGroup/ns:publishUrl";

	var xmlSetting = new XmlPokeSettings {
		Namespaces = new Dictionary<string, string> {
			{"ns", @"http://schemas.microsoft.com/developer/msbuild/2003"}
		}
	};
	XmlPoke(destination,importXPath,null,xmlSetting);
	XmlPoke(destination,publishUrlPath,$"{configuration.InstanceUrl}",xmlSetting);
});

Task("Sync-Unicorn")
.IsDependentOn("Turn-On-Unicorn")
.Does(() => {
	var unicornUrl = configuration.InstanceUrl + "unicorn.aspx";
	Information("Sync Unicorn items from url: " + unicornUrl);

	var authenticationFile = new FilePath($"{configuration.WebsiteRoot}/App_config/Include/Unicorn.SharedSecret.config");
	var xPath = "/configuration/sitecore/unicorn/authenticationProvider/SharedSecret";

	string sharedSecret = XmlPeek(authenticationFile, xPath);

	StartPowershellFile(unicornSyncScript, new PowershellSettings()
		.SetFormatOutput()
		.SetLogOutput()
		.WithArguments(args => {
			args.Append("secret", sharedSecret)
					.Append("url", unicornUrl);
		}));
});

Task("Apply-Xml-Transform").Does(() => {
	// target website transforms
	Transform($"{configuration.SourceFolder}\\Project\\AppItems\\code", configuration.WebsiteRoot);

	// xconnect transforms
	Transform($"{configuration.SourceFolder}\\Feature\\Automation\\xconnect\\App_Data\\Config\\sitecore\\MarketingAutomation", $"{configuration.XConnectAutomationServiceRoot}\\App_Data\\Config\\sitecore\\MarketingAutomation");
});

Task("Modify-Kiosk-Variable").Does(() => {
	var webConfigFile = File($"{configuration.WebsiteRoot}/Web.config");
	var appSetting = "configuration/appSettings/add[@key='kiosk:define']/@value";
	var appSettingValue = configuration.KioskAppDeploy ? "On" : "Off";
	XmlPoke(webConfigFile, appSetting, appSettingValue);
});

Task("Modify-ContentHub-Variable").Does(() => {
	var webConfigFile = File($"{configuration.WebsiteRoot}/Web.config");
	var appSetting = "configuration/appSettings/add[@key='contenthub:define']/@value";
	var appSettingValue = configuration.ContentHub ? "On" : "Off";
	XmlPoke(webConfigFile, appSetting, appSettingValue);
});

RunTarget(target);