using System.Collections.Generic;
using Sitecore.Demo.Fitness.Foundation.Analytics.Model;

namespace Sitecore.Demo.Fitness.Feature.Collection.Model
{
    public class SportPreferencesPayload : ISportPreferencesPayload
    {
        public Dictionary<string, int> Ratings { get; set; }

        // TODO: move model validation to attribute level
        public bool IsValid()
        {
            return Ratings != null && Ratings.Keys.Count > 0;
        }
    }
}