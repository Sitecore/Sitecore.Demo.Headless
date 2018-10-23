using Sitecore.Analytics.Pipelines.CommitSession;
using Sitecore.Analytics.XConnect.Facets;
using Sitecore.Diagnostics;
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
                        Log.Warn("**HF** UpdateFacetsFromTracker.Process(). Cannot resolve contact id from device", this);
                        return;
                    }

                    var sportsFacetSet = SetSportsFacet(facets, client, contact);
                    var personalFacetSet = SetPersonalFacet(facets, client, contact);
                    var emailFacetSet = SetEmailFacet(facets, client, contact);

                    if (sportsFacetSet || personalFacetSet || emailFacetSet)
                    {
                        client.Submit();
                    }
                }
                catch (XdbExecutionException ex)
                {
                    Log.Error("UpdateFacetsFromTracker failed miserably.", ex, this);
                }
            }
        }

        private bool SetDemographicsFacet(IReadOnlyDictionary<string, Facet> facets, XConnectClient client, IEntityReference<Contact> contact)
        {
            Log.Info($"**HF** UpdateFacetsFromTracker.Process(). Enter SetDemographicsFacet()", this);

            if (facets.TryGetValue(DemographicsFacet.DefaultKey, out Facet demographicsFacet))
            {
                if (demographicsFacet is DemographicsFacet demographics)
                {
                    Log.Info($"**HF** UpdateFacetsFromTracker.Process(). Setting SetDemographicsFacet()", this);
                    client.SetFacet(contact, DemographicsFacet.DefaultKey, demographics);
                    Log.Info($"**HF** UpdateFacetsFromTracker.Process(). Done SetDemographicsFacet()", this);
                    return true;
                }
                else
                {
                    Log.Error($"{DemographicsFacet.DefaultKey} facet is not of expected type. Expected {typeof(DemographicsFacet).FullName}", this);
                }
            }

            return false;
        }

        private bool SetEmailFacet(IReadOnlyDictionary<string, Facet> facets, XConnectClient client, IEntityReference<Contact> contact)
        {
            Log.Info($"**HF** UpdateFacetsFromTracker.Process(). Enter SetEmailFacet()", this);
            if (facets.TryGetValue(EmailAddressList.DefaultFacetKey, out Facet emailFacet))
            {
                if (emailFacet is EmailAddressList email)
                {
                    Log.Info($"**HF** UpdateFacetsFromTracker.Process(). Setting SetEmailFacet()", this);
                    client.SetEmails(contact, email);
                    Log.Info($"**HF** UpdateFacetsFromTracker.Process(). Done SetEmailFacet()", this);
                    return true;
                }
                else
                {
                    Log.Error($"{EmailAddressList.DefaultFacetKey} facet is not of expected type. Expected {typeof(EmailAddressList).FullName}", this);
                }
            }

            return false;
        }

        private bool SetPersonalFacet(IReadOnlyDictionary<string, Facet> facets, XConnectClient client, IEntityReference<Contact> contact)
        {
            Log.Info($"**HF** UpdateFacetsFromTracker.Process(). Enter SetPersonalFacet()", this);
            if (facets.TryGetValue(PersonalInformation.DefaultFacetKey, out Facet personalFacet))
            {
                if (personalFacet is PersonalInformation personal)
                {
                    Log.Info($"**HF** UpdateFacetsFromTracker.Process(). Setting SetPersonalFacet()", this);
                    client.SetPersonal(contact, personal);
                    Log.Info($"**HF** UpdateFacetsFromTracker.Process(). Setting SetPersonalFacet()", this);
                    return true;
                }
                else
                {
                    Log.Error($"{PersonalInformation.DefaultFacetKey} facet is not of expected type. Expected {typeof(PersonalInformation).FullName}", this);
                }
            }

            return false;
        }

        private bool SetSportsFacet(IReadOnlyDictionary<string, Facet> facets, XConnectClient client, IEntityReference<Contact> contact)
        {
            Log.Info($"**HF** UpdateFacetsFromTracker.Process(). Enter SetSportsFacet()", this);
            if (facets.TryGetValue(SportsFacet.DefaultKey, out Facet sportsFacet))
            {
                if (sportsFacet is SportsFacet sports)
                {
                    Log.Info($"**HF** UpdateFacetsFromTracker.Process(). Setting SetSportsFacet()", this);
                    client.SetFacet(contact, SportsFacet.DefaultKey, sports);
                    Log.Info($"**HF** UpdateFacetsFromTracker.Process(). Setting SetSportsFacet()", this);
                    return true;
                }
                else
                {
                    Log.Error($"{SportsFacet.DefaultKey} facet is not of expected type. Expected {typeof(SportsFacet).FullName}", this);
                }
            }

            return false;
        }
    }
}