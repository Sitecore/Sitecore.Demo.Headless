namespace Sitecore.HabitatHome.Fitness.Collection
{
    public static class Settings
    {
        public static readonly string MobileAppHostName = Configuration.Settings.GetSetting("HabitatHome.Fitness.MobileAppHostName", "http://localhost:3000");
        public static readonly string EmailApiKey = Configuration.Settings.GetSetting("HabitatHome.Fitness.EmailApiKey");
    }
}