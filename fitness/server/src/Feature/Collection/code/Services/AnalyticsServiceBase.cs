using System.Collections.Generic;
using Sitecore.Analytics;
using Sitecore.Diagnostics;
using Sitecore.XConnect;
using Sitecore.XConnect.Client;
using Sitecore.XConnect.Client.Configuration;

namespace Sitecore.Demo.Fitness.Feature.Collection.Services
{
    public abstract class AnalyticsServiceBase
    {
        protected void UpdateXConnectContact(Dictionary<string, Facet> facets)
        {
            var manager = Configuration.Factory.CreateObject("tracking/contactManager", true) as Sitecore.Analytics.Tracking.ContactManager;
            using (var client = SitecoreXConnectClientConfiguration.GetClient())
            {
                try
                {
                    var contactId = client.GetContactIdFromDevice();
                    if (contactId == null)
                    {
                        Log.Fatal("**HF** AnalyticsServiceBase.UpdateXConnectContact. Cannot resolve contact id from device", this);
                        return;
                    }

                    SetContactFacets(facets, client, contactId);

                    client.Submit();
                    manager.RemoveFromSession(Sitecore.Analytics.Tracker.Current.Contact.ContactId);
                    Tracker.Current.Session.Contact = manager.LoadContact(Sitecore.Analytics.Tracker.Current.Contact.ContactId);
                }
                catch (XdbExecutionException ex)
                {
                    Log.Error("UpdateXConnectContact failed.", ex, this);
                }
            }
        }

        protected static Facet GetFacetOrDefault(Dictionary<string, Facet> facets, string key, Contact contact, XConnectClient client)
        {
            contact.Facets.TryGetValue(key, out Facet currentFacet);
            facets.TryGetValue(key, out Facet facet);
            if (currentFacet != null)
            {
                facet = currentFacet.GetFacetWithDefaultValues(facet);
            }

            return facet;
        }

        protected abstract void SetContactFacets(Dictionary<string, Facet> facets, XConnectClient client,
            IEntityReference<Contact> contactId);
    }
}