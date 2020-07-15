using System.Collections.Generic;
using System.Linq;
using Sitecore.Analytics;
using Sitecore.Diagnostics;
using Sitecore.Demo.Fitness.Foundation.Analytics.Facets;
using Sitecore.Demo.Fitness.Foundation.Analytics.Model;
using Sitecore.Demo.Fitness.Foundation.Analytics.Services;
using Sitecore.XConnect;
using Sitecore.XConnect.Client;

namespace Sitecore.Demo.Fitness.Feature.Collection.Services
{
    public class SportsService : AnalyticsServiceBase, ISportsService
    {
        public void UpdateFacet([NotNull]ISportPreferencesPayload data)
        {
            var trackerContact = ContactExtensions.GetCurrentTrackerContact();
            Assert.IsNotNull(trackerContact, "Current contact is null");

            var facets = trackerContact.GetXConnectFacets();

            UpdateSportsFacet(data, facets);

            trackerContact.UpdateXConnectFacets(facets);
            UpdateXConnectContact(facets);
        }

        public void UpdateProfile([NotNull]ISportPreferencesPayload data)
        {
            Tracker.Current.Interaction.Profiles.Remove(SportsFacet.DefaultKey);
            if(data.Ratings != null)
            {
                Tracker.Current.Interaction.Profiles[SportsFacet.DefaultKey].Score(data.Ratings.ToDictionary(kvp => kvp.Key, kvp => (double)kvp.Value));
            }
        }

        public SportsFacet ReadFacet()
        {
            var trackerContact = ContactExtensions.GetCurrentTrackerContact();
            Assert.IsNotNull(trackerContact, "Current contact is null");

            var facets = trackerContact.GetXConnectFacets();

            if (!facets.ContainsKey(SportsFacet.DefaultKey))
            {
                return null;
            }

            if (facets[SportsFacet.DefaultKey] is SportsFacet facet)
            {
                return facet;
            }

            return null;
        }

        protected void UpdateSportsFacet(ISportPreferencesPayload data, Dictionary<string, Facet> facets)
        {
            SportsFacet sportsFacet;
            if (facets.ContainsKey(SportsFacet.DefaultKey))
            {
                sportsFacet = (SportsFacet)facets[SportsFacet.DefaultKey];
                sportsFacet.Ratings = data.Ratings;
            }
            else
            {
                sportsFacet = new SportsFacet()
                {
                    Ratings = data.Ratings,
                };

                facets.Add(SportsFacet.DefaultKey, sportsFacet);
            }
        }

        protected override void SetContactFacets(Dictionary<string, Facet> facets, XConnectClient client, IEntityReference<Contact> contactId)
        {
            var contact = client.Get<Contact>(contactId, new ContactExpandOptions(SportsFacet.DefaultKey));
            var sportsFacet = GetFacetOrDefault(facets, SportsFacet.DefaultKey, contact, client);
            if (sportsFacet is SportsFacet sports)
            {
                client.SetFacet(contact, SportsFacet.DefaultKey, sportsFacet as SportsFacet);
            }
        }
    }
}