#addin "Cake.XdtTransform"
#addin "Cake.Powershell"
#addin "Cake.Http"
#addin "Cake.Json"
#addin "Newtonsoft.Json"
#addin "Cake.Incubator"
#addin "Cake.Services"

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
    PublishProjects($"{configuration.ProjectSrcFolder}\\Fitness.AppItems", configuration.WebsiteRoot);
    PublishProjects($"{configuration.ProjectSrcFolder}\\Fitness.Automation", configuration.WebsiteRoot);
    PublishProjects($"{configuration.ProjectSrcFolder}\\Fitness.Collection", configuration.WebsiteRoot);
    PublishProjects($"{configuration.ProjectSrcFolder}\\Fitness.Personalization", configuration.WebsiteRoot);
    PublishProjects($"{configuration.ProjectSrcFolder}\\Fitness.Segmentation", configuration.WebsiteRoot);
});

Task("Stop-XConnect-Service").Does(()=>{
   var connectionStringFile = new FilePath($"{configuration.WebsiteRoot}/App_config/ConnectionStrings.config");
   var xPath = "connectionStrings/add[@name='xconnect.collection']/@connectionString";
   string xConnectUrl = XmlPeek(connectionStringFile, xPath);
   var uri = new Uri(xConnectUrl);
   string uriWithoutProtocol = uri.Host;
   StopService($"{uriWithoutProtocol}-MarketingAutomationService");
});

Task("Start-XConnect-Service").Does(()=>{
   var connectionStringFile = new FilePath($"{configuration.WebsiteRoot}/App_config/ConnectionStrings.config");
   var xPath = "connectionStrings/add[@name='xconnect.collection']/@connectionString";
   string xConnectUrl = XmlPeek(connectionStringFile, xPath);
   var uri = new Uri(xConnectUrl);
   string uriWithoutProtocol = uri.Host;
   StartService($"{uriWithoutProtocol}-MarketingAutomationService");
});

Task("Publish-XConnect").Does(()=>{
   DeployFiles(
       $"{configuration.ProjectSrcFolder}\\Fitness.Collection.Model.Deploy\\bin\\Debug\\Sitecore.HabitatHome.Fitness.*.dll",
       $"{configuration.XConnectRoot}\\bin"
	);
    DeployFiles(
        $"{configuration.ProjectSrcFolder}\\Fitness.Collection.Model.Deploy\\xmodels\\*",
        $"{configuration.XConnectRoot}\\App_Data\\Models"
    );
    DeployFiles(
        $"{configuration.ProjectSrcFolder}\\Fitness.Collection.Model.Deploy\\xmodels\\*",
        $"{configuration.XConnectIndexerRoot}\\App_Data\\Models"
    );
    DeployFiles(
        $"{configuration.ProjectSrcFolder}\\Fitness.Automation\\bin\\Sitecore.HabitatHome.Fitness.Automation.dll",
        $"{configuration.XConnectAutomationServiceRoot}"
    );
    DeployFiles(
        $"{configuration.ProjectSrcFolder}\\Fitness.Automation\\bin\\Sitecore.HabitatHome.Fitness.Collection.Model.dll",
        $"{configuration.XConnectAutomationServiceRoot}"
    );
    DeployFiles(
        $"{configuration.ProjectSrcFolder}\\Fitness.Collection.Model.Deploy\\automation\\*",
        $"{configuration.XConnectAutomationServiceRoot}\\App_Data\\Config\\sitecore"
    );
    DeployFiles(
        $"{configuration.ProjectSrcFolder}\\Fitness.Automation\\App_Data\\Config\\Sitecore\\MarketingAutomation\\*.xml",
        $"{configuration.XConnectAutomationServiceRoot}\\App_Data\\Config\\sitecore\\MarketingAutomation "
    );
});
Task("Modify-Unicorn-Source-Folder").Does(() => {
    var zzzDevSettingsFile = File($"{configuration.WebsiteRoot}/App_config/Include/Sitecore.HabitatHome.Fitness/z.Sitecore.HabitatHome.Fitness.DevSettings.config");
    
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

Task("Sync-Unicorn").Does(() => {
    var unicornUrl = configuration.InstanceUrl + "unicorn.aspx";
    Information("Sync Unicorn items from url: " + unicornUrl);

    var authenticationFile = new FilePath($"{configuration.WebsiteRoot}/App_config/Include/Unicorn/Unicorn.zSharedSecret.config");
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
	Transform($"{configuration.ProjectSrcFolder}\\Fitness.AppItems", configuration.WebsiteRoot);

	// xconnect transforms
	Transform($"{configuration.ProjectSrcFolder}\\Fitness.Automation\\App_Data\\Config\\sitecore\\MarketingAutomation", $"{configuration.XConnectAutomationServiceRoot}\\App_Data\\Config\\sitecore\\MarketingAutomation");
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