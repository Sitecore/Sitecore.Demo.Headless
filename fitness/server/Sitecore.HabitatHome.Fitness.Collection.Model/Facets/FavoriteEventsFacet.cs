using Sitecore.XConnect;
using System;
using System.Collections.Generic;

namespace Sitecore.HabitatHome.Fitness.Collection.Model.Facets
{
    [Serializable]
    public class FavoriteEventsFacet : Facet
    {
        public FavoriteEventsFacet()
        {
            Values = new List<string>();
        }

        public static string DefaultKey = "FavoriteEvents";

        public List<string> Values { get; set; }
    }
}