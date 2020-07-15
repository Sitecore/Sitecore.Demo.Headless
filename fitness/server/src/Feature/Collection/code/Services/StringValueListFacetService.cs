﻿using System.Collections.Generic;
using System.Linq;
using Sitecore.Diagnostics;
using Sitecore.Demo.Fitness.Foundation.Analytics;
using Sitecore.Demo.Fitness.Foundation.Analytics.Facets;
using Sitecore.Demo.Fitness.Foundation.Analytics.Services;
using Sitecore.XConnect;
using Sitecore.XConnect.Client;

namespace Sitecore.Demo.Fitness.Feature.Collection.Services
{
    // TODO: Add/Remove have the same boilerplate
    public class StringValueListFacetService : AnalyticsServiceBase, IStringValueListFacetService
    {
        public void Add([NotNull] string value, [NotNull]string facetKey)
        {
            var trackerContact = ContactExtensions.GetCurrentTrackerContact();
            Assert.IsNotNull(trackerContact, "Current contact is null");

            var facets = trackerContact.GetXConnectFacets();
            AddFacetValue(value, facetKey, facets);
            trackerContact.UpdateXConnectFacets(facets);
            UpdateXConnectContact(facets);
        }

        public void Remove([NotNull] string value, [NotNull]string facetKey)
        {
            var trackerContact = ContactExtensions.GetCurrentTrackerContact();
            Assert.IsNotNull(trackerContact, "Current contact is null");

            var facets = trackerContact.GetXConnectFacets();
            RemoveFacetValue(value, facetKey, facets);
            trackerContact.UpdateXConnectFacets(facets);
            UpdateXConnectContact(facets);
        }

        public void RemoveAll([NotNull]string facetKey)
        {
            var trackerContact = ContactExtensions.GetCurrentTrackerContact();
            Assert.IsNotNull(trackerContact, "Current contact is null");

            var facets = trackerContact.GetXConnectFacets();
            RemoveAllFacetValues(facetKey, facets);
            trackerContact.UpdateXConnectFacets(facets);
            UpdateXConnectContact(facets);
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

        protected override void SetContactFacets(Dictionary<string, Facet> facets, XConnectClient client, IEntityReference<Contact> contactId)
        {
            var keys = new List<string>() { FacetIDs.FavoriteEvents, FacetIDs.RegisteredEvents, FacetIDs.Subscriptions, FacetIDs.SubscriptionTokens };
            var contact = client.Get<Contact>(contactId, new ContactExpandOptions(keys.ToArray()));

            foreach (var facetKey in keys)
            {
                var stringValueFacet = GetFacetOrDefault(facets, facetKey, contact, client);
                if (stringValueFacet is StringValueListFacet stringValue)
                {
                    client.SetFacet(contact, facetKey, stringValue);
                }
            }
        }
    }
}