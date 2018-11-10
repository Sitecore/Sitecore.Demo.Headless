using Sitecore.Diagnostics;
using Sitecore.XConnect;
using System.Collections.Generic;
using Sitecore.HabitatHome.Fitness.Collection.Model.Facets;

namespace Sitecore.HabitatHome.Fitness.Collection.Services
{
    // TODO: Add/Remove have the same boilerplate
    public class StringValueListFacetService : IStringValueListFacetService
    {
        public void Add([NotNull] string value, [NotNull]string facetKey)
        {
            var trackerContact = ContactExtensions.GetCurrentTrackerContact();
            Assert.IsNotNull(trackerContact, "Current contact is null");

            var facets = trackerContact.GetXConnectFacets();
            AddFacetValue(value, facetKey, facets);
            trackerContact.UpdateXConnectFacets(facets);
        }

        public void Remove([NotNull] string value, [NotNull]string facetKey)
        {
            var trackerContact = ContactExtensions.GetCurrentTrackerContact();
            Assert.IsNotNull(trackerContact, "Current contact is null");

            var facets = trackerContact.GetXConnectFacets();
            RemoveFacetValue(value, facetKey, facets);
            trackerContact.UpdateXConnectFacets(facets);
        }

        public void RemoveAll([NotNull]string facetKey)
        {
            var trackerContact = ContactExtensions.GetCurrentTrackerContact();
            Assert.IsNotNull(trackerContact, "Current contact is null");

            var facets = trackerContact.GetXConnectFacets();
            RemoveAllFacetValues(facetKey, facets);
            trackerContact.UpdateXConnectFacets(facets);
        }

        public bool ContainsValue([NotNull] string facetKey, [NotNull] string facetValue)
        {
            var trackerContact = ContactExtensions.GetCurrentTrackerContact();
            Assert.IsNotNull(trackerContact, "Current contact is null");
            var facets = trackerContact.GetXConnectFacets();

            if (!facets.ContainsKey(facetKey))
            {
                return false;
            }

            if (facets[facetKey] is StringValueListFacet facet)
            {
                return facet.Values.Contains(facetValue);
            }

            return false; 
        }

        protected void AddFacetValue([NotNull]string value, [NotNull]string facetKey, [NotNull]Dictionary<string, Facet> facets)
        {
            StringValueListFacet facet;
            if (facets.ContainsKey(facetKey))
            {
                facet = (StringValueListFacet)facets[facetKey];
                if (!facet.Values.Contains(value))
                {
                    facet.Values.Add(value);
                }
            }
            else
            {
                facet = new StringValueListFacet();
                facet.Values.Add(value);
                facets.Add(facetKey, facet);
            }
        }

        protected void RemoveFacetValue([NotNull]string value, [NotNull]string facetKey, [NotNull]Dictionary<string, Facet> facets)
        {
            StringValueListFacet facet;
            if (facets.ContainsKey(facetKey))
            {
                facet = (StringValueListFacet)facets[facetKey];

                if (facet.Values.Contains(value))
                {
                    facet.Values.Remove(value);
                }
            }
        }

        protected void RemoveAllFacetValues([NotNull]string facetKey, [NotNull]Dictionary<string, Facet> facets)
        {
            StringValueListFacet facet;
            if (facets.ContainsKey(facetKey))
            {
                facet = (StringValueListFacet)facets[facetKey];
                facet.Values.Clear();
            }
        }
    }
}