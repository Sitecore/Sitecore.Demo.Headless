using Sitecore.Configuration;
using System;

namespace Sitecore.HabitatHome.Fitness.Collection
{
    public static class Config
    {
        public static readonly string PublicHostName = Settings.GetSetting("HabitatFitness.PublicHostName");
        public static readonly string FirebaseMessagingApiUri = Settings.GetSetting("HabitatFitness.FirebaseMessagingApiUri");
        public static readonly string FirebaseMessagingApiKey = Settings.GetSetting("HabitatFitness.FirebaseMessagingApiKey");
    }
}