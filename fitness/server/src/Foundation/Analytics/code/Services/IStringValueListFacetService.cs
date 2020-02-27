using System.Collections.Generic;
using Sitecore.XConnect;
using Sitecore.XConnect.Client;

namespace Sitecore.HabitatHome.Fitness.Foundation.Analytics.Services
{
    public interface IStringValueListFacetService
    {
        void Add(string value, string facetKey);
        void Remove(string value, string facetKey);
        void RemoveAll(string facetKey);
        bool ContainsValue(string facetKey, string facetValue);
        string[] GetFacetValues(string facetKey);
    }
}