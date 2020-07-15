using System.Collections.Generic;
using System.Linq;
using Sitecore.Analytics;
using Sitecore.Analytics.Data.Items;
using Sitecore.Analytics.Tracking;
using Sitecore.Diagnostics;

namespace Sitecore.Demo.Fitness.Feature.Personalization.Utils
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

        public static string[] GetPopulatedProfilesFromTracker(this ITracker tracker)
        {
            return GetProfilesFromTracker(tracker).ToArray();
        }

        private static IEnumerable<string> GetProfilesFromTracker(this ITracker tracker)
        {
            var trackerProfiles = tracker?.Interaction?.Profiles;
            if (trackerProfiles != null)
            {
                foreach (var profileName in trackerProfiles.GetProfileNames())
                {
                    Profile profile = trackerProfiles[profileName];
                    if (profile.Count > 0)
                    {
                        foreach (KeyValuePair<string, double> profileKey in profile)
                        {
                            if (profileKey.Value > 0)
                            {
                                yield return profileKey.Key.ToLowerInvariant();
                            }
                        }
                    }
                }
            }
        }
    }
}