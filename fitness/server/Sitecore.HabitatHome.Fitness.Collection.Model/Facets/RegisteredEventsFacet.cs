using Sitecore.XConnect;
using System;
using System.Collections.Generic;

namespace Sitecore.HabitatHome.Fitness.Collection.Model.Facets
{
    [Serializable]
    public class RegisteredEventsFacet : Facet
    {
        public RegisteredEventsFacet()
        {
            Values = new List<string>();
        }

        public static string DefaultKey = "RegisteredEvents";

        public List<string> Values { get; set; }
    }
}