using System.Collections.Generic;

namespace Sitecore.HabitatHome.Fitness.Collection.Model
{
    public class SportPreferencesPayload
    {
        public Dictionary<string, int> Ratings { get; set; }

        // TODO: move model validation to attribute level
        public bool IsValid()
        {
            return Ratings != null && Ratings.Keys.Count > 0;
        }
    }
}