using Sitecore.Analytics;
using Sitecore.Analytics.XConnect.Facets;
using Sitecore.Diagnostics;
using Sitecore.XConnect;
using Sitecore.XConnect.Collection.Model;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Sitecore.HabitatHome.Fitness.Collection.Services
{
    public static class ContactExtensions
    {
        public static Analytics.Tracking.Contact GetCurrentTrackerContact()
        {
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

        public static string GetPreferredEmail(this Contact contact)
        {
            if (contact.Facets.TryGetValue(EmailAddressList.DefaultFacetKey, out Facet emailFacet))
            {
                if (emailFacet is EmailAddressList email)
                {
                    return email.PreferredEmail.SmtpAddress;
                }
                else
                {
                    Log.Error($"{EmailAddressList.DefaultFacetKey} facet is not of expected type. Expected {typeof(EmailAddressList).FullName}", new object());
                    return string.Empty;
                }
            }

            return string.Empty;
        }

        public static bool CompletedRegistration(this Analytics.Tracking.Session session)
        {
            return session.Interaction.Pages.SelectMany(p => p.PageEvents).Any(e => e.IsGoal && e.PageEventDefinitionId == Wellknown.CompleteRegistrationGoalId);
        }

        public static string GetName(this Contact contact)
        {
            if (contact.Facets.TryGetValue(PersonalInformation.DefaultFacetKey, out Facet facet))
            {
                if (facet is PersonalInformation personalInformation)
                {
                    return personalInformation.FirstName;
                }
                else
                {
                    Log.Error($"{PersonalInformation.DefaultFacetKey} facet is not of expected type. Expected {typeof(PersonalInformation).FullName}", new object());
                    return string.Empty;
                }
            }

            return string.Empty;
        }
    }
}