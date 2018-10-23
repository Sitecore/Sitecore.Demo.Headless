using Sitecore.XConnect;
using System;
using System.Collections.Generic;

namespace Sitecore.HabitatHome.Fitness.Collection.Model.Facets
{
    [Serializable]
    public class SportsFacet : Facet
    {
        public static string DefaultKey = "Sports";
        public Dictionary<string, int> Ratings { get; set; }
    }
}
