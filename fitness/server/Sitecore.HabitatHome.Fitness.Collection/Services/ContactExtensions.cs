using Sitecore.Analytics;
using Sitecore.Analytics.XConnect.Facets;
using Sitecore.Diagnostics;
using Sitecore.XConnect;
using System.Collections.Generic;
using System.Linq;

namespace Sitecore.HabitatHome.Fitness.Collection.Services
{
    public static class ContactExtensions
    {
        public static Analytics.Tracking.Contact GetCurrentTrackerContact()
        {
            Assert.IsTrue(Tracker.Current != null && Tracker.IsActive, "Tracker is not active");
            return Tracker.Current?.Contact;
        }

        public static Dictionary<string, Facet> GetXConnectFacets(this Analytics.Tracking.Contact trackerContact)
        {
            Assert.IsTrue(trackerContact.Facets.ContainsKey("XConnectFacets"), "FacetUpdateService: XConnectFacets are missing");

            var facets = new Dictionary<string, Facet>();
            var existingFacets = trackerContact.GetFacet<IXConnectFacets>("XConnectFacets").Facets;
            if (existingFacets != null)
            {
                return existingFacets.ToDictionary(kvp => kvp.Key, kvp => kvp.Value);
            }

            return new Dictionary<string, Facet>();
        }

        public static void UpdateXConnectFacets(this Analytics.Tracking.Contact trackerContact, [NotNull]Dictionary<string, Facet> facets)
        {
            trackerContact.GetFacet<IXConnectFacets>("XConnectFacets").Facets = facets;
        }
    }
}