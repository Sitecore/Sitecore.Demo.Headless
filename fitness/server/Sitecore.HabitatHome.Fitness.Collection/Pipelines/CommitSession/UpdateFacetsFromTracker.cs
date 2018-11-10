using Sitecore.Analytics.Pipelines.CommitSession;
using Sitecore.Analytics.XConnect.Facets;
using Sitecore.Diagnostics;
using Sitecore.HabitatHome.Fitness.Collection.Model;
using Sitecore.HabitatHome.Fitness.Collection.Model.Facets;
using Sitecore.XConnect;
using Sitecore.XConnect.Client;
using Sitecore.XConnect.Client.Configuration;
using Sitecore.XConnect.Collection.Model;
using System.Collections.Generic;

namespace Sitecore.HabitatHome.Fitness.Collection.Pipelines.CommitSession
{
    public class UpdateFacetsFromTracker : CommitSessionProcessor
    {
        public override void Process(CommitSessionPipelineArgs args)
        {
            var facets = args.Session.Contact.GetFacet<IXConnectFacets>("XConnectFacets")?.Facets;
            if (facets == null)
            {
                Log.Warn($"**HF** UpdateFacetsFromTracker.Process(). XConnectFacets could not be loaded for contact {args.Session.Contact.ContactId.ToString()}", this);
                return;
            }

            using (var client = SitecoreXConnectClientConfiguration.GetClient())
            {
                try
                {
                    var contact = client.GetContactIdFromDevice();
                    if (contact == null)
                    {
                        Log.Fatal("**HF** UpdateFacetsFromTracker.Process(). Cannot resolve contact id from device", this);
                        return;
                    }

                    SetPersonalFacet(facets, client, contact);
                    SetEmailFacet(facets, client, contact);
                    SetSportsFacet(facets, client, contact);

                    SetStringValueListFacet(facets, client, contact, FacetIDs.FavoriteEvents);
                    SetStringValueListFacet(facets, client, contact, FacetIDs.RegisteredEvents);
                    SetStringValueListFacet(facets, client, contact, FacetIDs.Subscriptions);
                    SetStringValueListFacet(facets, client, contact, FacetIDs.SubscriptionTokens);

                    client.Submit();
                }
                catch (XdbExecutionException ex)
                {
                    Log.Error("UpdateFacetsFromTracker failed miserably.", ex, this);
                }
            }
        }

        private void SetStringValueListFacet(IReadOnlyDictionary<string, Facet> facets, XConnectClient client, IEntityReference<Contact> contact, [NotNull]string key)
        {
            if (facets.TryGetValue(key, out Facet facet))
            {
                if (facet is StringValueListFacet typedFacet)
                {
                    client.SetFacet(contact, key, typedFacet);
                }
                else
                {
                    Log.Error($"{key} facet is not of expected type. Expected {typeof(StringValueListFacet).FullName}", this);
                }
            }
        }

        private void SetDemographicsFacet(IReadOnlyDictionary<string, Facet> facets, XConnectClient client, IEntityReference<Contact> contact)
        {
            if (facets.TryGetValue(DemographicsFacet.DefaultKey, out Facet demographicsFacet))
            {
                if (demographicsFacet is DemographicsFacet demographics)
                {
                    client.SetFacet(contact, DemographicsFacet.DefaultKey, demographics);
                }
                else
                {
                    Log.Error($"{DemographicsFacet.DefaultKey} facet is not of expected type. Expected {typeof(DemographicsFacet).FullName}", this);
                }
            }
        }

        private void SetEmailFacet(IReadOnlyDictionary<string, Facet> facets, XConnectClient client, IEntityReference<Contact> contact)
        {
            if (facets.TryGetValue(EmailAddressList.DefaultFacetKey, out Facet emailFacet))
            {
                if (emailFacet is EmailAddressList email)
                {
                    client.SetEmails(contact, email);
                }
                else
                {
                    Log.Error($"{EmailAddressList.DefaultFacetKey} facet is not of expected type. Expected {typeof(EmailAddressList).FullName}", this);
                }
            }
        }

        private void SetPersonalFacet(IReadOnlyDictionary<string, Facet> facets, XConnectClient client, IEntityReference<Contact> contact)
        {
            if (facets.TryGetValue(PersonalInformation.DefaultFacetKey, out Facet personalFacet))
            {
                if (personalFacet is PersonalInformation personal)
                {
                    client.SetPersonal(contact, personal);
                }
                else
                {
                    Log.Error($"{PersonalInformation.DefaultFacetKey} facet is not of expected type. Expected {typeof(PersonalInformation).FullName}", this);
                }
            }
        }

        private void SetSportsFacet(IReadOnlyDictionary<string, Facet> facets, XConnectClient client, IEntityReference<Contact> contact)
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
    }
}