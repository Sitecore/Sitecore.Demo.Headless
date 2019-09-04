using System;
using System.Collections.Generic;
using Sitecore.XConnect;

namespace Sitecore.HabitatHome.Fitness.Foundation.Analytics.Facets
{
    [Serializable]
    public class SportsFacet : Facet
    {
        public static string DefaultKey = "Sports";

        public Dictionary<string, int> Ratings { get; set; }
    }
}
