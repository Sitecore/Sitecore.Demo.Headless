using Sitecore.XConnect;
using System;

namespace Sitecore.HabitatHome.Fitness.Collection.Model.Facets
{
    [Serializable]
    public class DemographicsFacet : Facet
    {
        public static string DefaultKey = "Demographics";
        public string AgeGroup { get; set; }
    }
}