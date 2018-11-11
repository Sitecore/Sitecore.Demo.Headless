using Sitecore.Analytics.Data.Items;
using Sitecore.Diagnostics;

namespace Sitecore.HabitatHome.Fitness.Personalization.Utils
{
    public static class ProfileExtensions
    {
        public static string GetProfileKeyName(string profilePath)
        {
            var profileKeyItem = Context.Database.GetItem(profilePath);
            if (profileKeyItem == null)
            {
                Log.Warn($"SportsCondition: Unable to resolve profile key item {profilePath}", new object());
                return string.Empty;
            }
            return new ProfileKeyItem(profileKeyItem).KeyName;
        }
    }
}