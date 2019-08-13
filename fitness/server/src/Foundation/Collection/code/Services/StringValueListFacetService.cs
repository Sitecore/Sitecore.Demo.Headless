using Sitecore.Diagnostics;
using Sitecore.XConnect;
using System.Collections.Generic;
using Sitecore.HabitatHome.Fitness.Foundation.Collection.Model.Facets;
using Sitecore.XConnect.Client;

namespace Sitecore.HabitatHome.Fitness.Foundation.Collection.Services
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

        public string[] GetFacetValues([NotNull]string facetKey)
        {
            var trackerContact = ContactExtensions.GetCurrentTrackerContact();
            Assert.IsNotNull(trackerContact, "Current contact is null");

            var facets = trackerContact.GetXConnectFacets();

            StringValueListFacet facet;
            if (facets.ContainsKey(facetKey))
            {
                facet = (StringValueListFacet)facets[facetKey];
                return facet.Values.ToArray();
            }

            return new string[0];
        }

        public void SetFacet(IReadOnlyDictionary<string, Facet> facets, XConnectClient client, IEntityReference<Contact> contact, [NotNull]string facetKey)
        {
            if (facets.TryGetValue(facetKey, out Facet facet))
            {
                if (facet is StringValueListFacet typedFacet)
                {
                    client.SetFacet(contact, facetKey, typedFacet);
                }
                else
                {
                    Log.Error($"{facetKey} facet is not of expected type. Expected {typeof(StringValueListFacet).FullName}", this);
                }
            }
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