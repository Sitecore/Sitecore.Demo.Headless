using System;
using System.Collections.Generic;
using Sitecore.XConnect;

namespace Sitecore.Demo.Fitness.Foundation.Analytics.Facets
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