using Sitecore.Analytics.XConnect.Facets;
using Sitecore.Diagnostics;
using Sitecore.XConnect;
using System.Collections.Generic;
using Sitecore.HabitatHome.Fitness.Foundation.Collection.Model.Facets;
using Sitecore.Analytics;
using System.Linq;
using Sitecore.HabitatHome.Fitness.Foundation.Collection.Model;
using Sitecore.XConnect.Client;

namespace Sitecore.HabitatHome.Fitness.Foundation.Collection.Services
{
    public class SportsService : ISportsService
    {
        public void UpdateFacet([NotNull]SportPreferencesPayload data)
        {
            var trackerContact = ContactExtensions.GetCurrentTrackerContact();
            Assert.IsNotNull(trackerContact, "Current contact is null");

            var facets = trackerContact.GetXConnectFacets();

            UpdateSportsFacet(data, facets);

            trackerContact.UpdateXConnectFacets(facets);
        }

        public void UpdateProfile([NotNull]SportPreferencesPayload data)
        {
            Tracker.Current.Interaction.Profiles.Remove(SportsFacet.DefaultKey);
            if(data.Ratings != null)
            {
                Tracker.Current.Interaction.Profiles[SportsFacet.DefaultKey].Score(data.Ratings.ToDictionary(kvp => kvp.Key, kvp => (double)kvp.Value));
            }
        }

        public void SetFacet(IReadOnlyDictionary<string, Facet> facets, XConnectClient client, IEntityReference<Contact> contact)
        {
            if (facets.TryGetValue(SportsFacet.DefaultKey, out Facet sportsFacet))
            {
                if (sportsFacet is SportsFacet sports)
                {
                    client.SetFacet(contact, SportsFacet.DefaultKey, sports);
                }
                else
                {
                    Log.Error($"{SportsFacet.DefaultKey} facet is not of expected type. Expected {typeof(SportsFacet).FullName}", this);
                }
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

        protected void UpdateSportsFacet(SportPreferencesPayload data, Dictionary<string, Facet> facets)
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
    }
}