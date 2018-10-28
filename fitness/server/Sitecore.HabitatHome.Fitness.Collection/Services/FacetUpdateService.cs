using Sitecore.Analytics;
using Sitecore.Analytics.XConnect.Facets;
using Sitecore.Diagnostics;
using Sitecore.XConnect;
using Sitecore.XConnect.Collection.Model;
using System.Collections.Generic;
using System.Linq;
using Sitecore.HabitatHome.Fitness.Collection.Model;
using Sitecore.HabitatHome.Fitness.Collection.Model.Facets;
using System;

namespace Sitecore.HabitatHome.Fitness.Collection.Services
{
    // TODO: refactor interface methods, too much boilerplate
    public class FacetUpdateService : IFacetUpdateService
    {
        public void UpdateEventFavoritesFacet([NotNull] EventPayload data)
        {
            Assert.IsTrue(data.IsValid(), "event id cannot be empty");
            Assert.IsTrue(Guid.TryParse(data.EventId, out Guid eventGuid), "event id is not a guid");

            var trackerContact = GetTrackerContact();
            Assert.IsNotNull(trackerContact, "Current contact is null");

            var facets = GetXConnectFacets(trackerContact);

            UpdateEventFavorites(data, facets);

            Log.Info($"**HF** UpdateEventRegistrationFacet. Setting collected facets.", this);
            trackerContact.GetFacet<IXConnectFacets>("XConnectFacets").Facets = facets;
        }

        public void UpdateEventRegistrationFacet([NotNull] EventPayload data)
        {
            Assert.IsTrue(data.IsValid(), "event id cannot be empty");
            Assert.IsTrue(Guid.TryParse(data.EventId, out Guid eventGuid), "event id is not a guid");

            var contact = GetTrackerContact();
            Assert.IsNotNull(contact, "Current contact is null");

            Assert.IsTrue(contact.IdentificationLevel == Analytics.Model.ContactIdentificationLevel.Known, "contact has to be known to be able to register");

            var facets = GetXConnectFacets(contact);

            UpdateEventRegistration(data, facets);

            Log.Info($"**HF** UpdateEventRegistrationFacet. Setting collected facets.", this);
            contact.GetFacet<IXConnectFacets>("XConnectFacets").Facets = facets;
        }

        public void UpdateDemographicsFacet([NotNull]DemographicsPayload data)
        {
            Assert.IsTrue(data.IsValid(), "DemographicsPayload is not valid");

            var trackerContact = GetTrackerContact();
            Assert.IsNotNull(trackerContact, "Current contact is null");

            var facets = GetXConnectFacets(trackerContact);

            UpdateAgeGroup(data, facets);
            UpdateGender(data, facets);

            Log.Info($"**HF** UpdateDemographicsFacet. Setting collected facets.", this);
            trackerContact.GetFacet<IXConnectFacets>("XConnectFacets").Facets = facets;
        }

        public void UpdateSportsFacet([NotNull]SportPreferencesPayload data)
        {
            Assert.IsTrue(data.IsValid(), "DemographicsPayload is not valid");

            var trackerContact = GetTrackerContact();
            Assert.IsNotNull(trackerContact, "Current contact is null");

            var facets = GetXConnectFacets(trackerContact);

            UpdateSportsFacet(data, facets);

            Log.Info($"**HF** UpdateSportsFacet. Setting collected facets.", this);
            trackerContact.GetFacet<IXConnectFacets>("XConnectFacets").Facets = facets;
        }

        public void UpdateIdentificationFacet([NotNull]IdentificationPayload data)
        {
            Assert.IsTrue(data.IsValid(), "DemographicsPayload is not valid");

            var trackerContact = GetTrackerContact();
            Assert.IsNotNull(trackerContact, "Current contact is null");

            var facets = GetXConnectFacets(trackerContact);

            UpdateName(data, facets);
            UpdateEmail(data, facets);

            Tracker.Current.Session.IdentifyAs(Wellknown.EMAIL_IDENT_SOURCE, data.Email);

            Log.Info($"**HF** UpdateIdentificationFacet. Setting collected facets.", this);
            trackerContact.GetFacet<IXConnectFacets>("XConnectFacets").Facets = facets;
        }

        protected void UpdateEventFavorites(EventPayload data, Dictionary<string, Facet> facets)
        {
            FavoriteEventsFacet facet;
            if (facets.ContainsKey(FavoriteEventsFacet.DefaultKey))
            {
                facet = (FavoriteEventsFacet)facets[FavoriteEventsFacet.DefaultKey];
                facet.Values.Add(data.EventId);
            }
            else
            {
                facet = new FavoriteEventsFacet();
                facet.Values.Add(data.EventId);
                facets.Add(FavoriteEventsFacet.DefaultKey, facet);
            }
        }
 
        protected void UpdateEventRegistration(EventPayload data, Dictionary<string, Facet> facets)
        {
            RegisteredEventsFacet facet;
            if (facets.ContainsKey(RegisteredEventsFacet.DefaultKey))
            {
                facet = (RegisteredEventsFacet)facets[RegisteredEventsFacet.DefaultKey];
                facet.Values.Add(data.EventId);
            }
            else
            {
                facet = new RegisteredEventsFacet();;
                facet.Values.Add(data.EventId);
                facets.Add(RegisteredEventsFacet.DefaultKey, facet);
            }
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

        protected void UpdateAgeGroup(DemographicsPayload data, Dictionary<string, Facet> facets)
        {
            DemographicsFacet facet;
            if (facets.ContainsKey(DemographicsFacet.DefaultKey))
            {
                facet = (DemographicsFacet)facets[DemographicsFacet.DefaultKey];
                facet.AgeGroup = data.AgeGroup;
            }
            else
            {
                facet = new DemographicsFacet()
                {
                    AgeGroup = data.AgeGroup,
                };

                facets.Add(DemographicsFacet.DefaultKey, facet);
            }
        }

        protected void UpdateGender(DemographicsPayload data, Dictionary<string, Facet> facets)
        {
            PersonalInformation personalInfo;
            if (facets.ContainsKey(PersonalInformation.DefaultFacetKey))
            {
                personalInfo = (PersonalInformation)facets[PersonalInformation.DefaultFacetKey];
                personalInfo.Gender = data.Gender;
            }
            else
            {
                personalInfo = new PersonalInformation()
                {
                    Gender = data.Gender,
                };

                facets.Add(PersonalInformation.DefaultFacetKey, personalInfo);
            }
        }

        protected void UpdateName(IdentificationPayload data, Dictionary<string, Facet> facets)
        {
            PersonalInformation personalInfo;
            if (facets.ContainsKey(PersonalInformation.DefaultFacetKey))
            {
                personalInfo = (PersonalInformation)facets[PersonalInformation.DefaultFacetKey];
                personalInfo.FirstName = data.FirstName;
                personalInfo.LastName = data.LastName;
            }
            else
            {
                personalInfo = new PersonalInformation()
                {
                    FirstName = data.FirstName,
                    LastName = data.LastName,
                };

                facets.Add(PersonalInformation.DefaultFacetKey, personalInfo);
            }
        }

        protected void UpdateEmail(IdentificationPayload data, Dictionary<string, Facet> facets)
        {
            EmailAddressList emails;
            if (facets.ContainsKey(EmailAddressList.DefaultFacetKey))
            {
                emails = (EmailAddressList)facets[EmailAddressList.DefaultFacetKey];
                emails.PreferredEmail = new EmailAddress(data.Email, true);
            }
            else
            {
                emails = new EmailAddressList(new EmailAddress(data.Email, true), Wellknown.PreferredEmailKey);
                facets.Add(EmailAddressList.DefaultFacetKey, emails);
            }
        }

        protected Analytics.Tracking.Contact GetTrackerContact()
        {
            Assert.IsTrue(Tracker.Current != null && Tracker.IsActive, "**HF** Tracker is not active");
            return Tracker.Current?.Contact;
        }

        protected Dictionary<string, Facet> GetXConnectFacets([NotNull]Analytics.Tracking.Contact trackerContact)
        {
            Assert.IsTrue(trackerContact.Facets.ContainsKey("XConnectFacets"), "**HF** FacetUpdateService: XConnectFacets are missing");

            Log.Info("**HF** XConnectFacets found", this);

            var facets = new Dictionary<string, Facet>();
            var existingFacets = trackerContact.GetFacet<IXConnectFacets>("XConnectFacets").Facets;
            if (existingFacets != null)
            {
                Log.Info("**HF** XConnectFacets existing facets found", this);
                return existingFacets.ToDictionary(kvp => kvp.Key, kvp => kvp.Value);
            }

            Log.Info("**HF** XConnectFacets returning empty facets", this);
            return new Dictionary<string, Facet>();
        }
    }
}