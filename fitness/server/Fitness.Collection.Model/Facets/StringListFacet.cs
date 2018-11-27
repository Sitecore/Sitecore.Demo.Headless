using Sitecore.XConnect;
using System;
using System.Collections.Generic;

namespace Sitecore.HabitatHome.Fitness.Collection.Model.Facets
{
    [Serializable]
    public class StringValueListFacet : Facet
    {
        public StringValueListFacet()
        {
            Values = new List<string>();
        }

        public List<string> Values { get; set; }
    }
}