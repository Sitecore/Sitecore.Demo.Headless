using System;
using Sitecore.XConnect;

namespace Sitecore.HabitatHome.Fitness.Foundation.Collection.Model.Facets
{
    [Serializable]
    public class DemographicsFacet : Facet
    {
        public static string DefaultKey = "Demographics";

        public string AgeGroup { get; set; }
    }
}