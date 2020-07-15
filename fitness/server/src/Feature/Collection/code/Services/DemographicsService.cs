using System.Collections.Generic;
using Sitecore.Analytics;
using Sitecore.Diagnostics;
using Sitecore.Demo.Fitness.Foundation.Analytics.Facets;
using Sitecore.Demo.Fitness.Foundation.Analytics.Model;
using Sitecore.Demo.Fitness.Foundation.Analytics.Services;
using Sitecore.XConnect;
using Sitecore.XConnect.Client;
using Sitecore.XConnect.Collection.Model;

namespace Sitecore.Demo.Fitness.Feature.Collection.Services
{
    public class DemographicsService : AnalyticsServiceBase, IDemographicsService
    {
        public void UpdateFacet([NotNull]IDemographicsPayload data)
        {
            var trackerContact = ContactExtensions.GetCurrentTrackerContact();
            Assert.IsNotNull(trackerContact, "Current contact is null");

            var facets = trackerContact.GetXConnectFacets();

            UpdateAgeGroup(data, facets);
            UpdateGender(data, facets);

            trackerContact.UpdateXConnectFacets(facets);
            UpdateXConnectContact(facets);
        }

        public void UpdateProfile([NotNull]IDemographicsPayload data)
        {
            UpdateGenderProfile(data);
            UpdateAgeGroupProfile(data);
        }

        public string GetAgeGroup()
        {
            var facet = ReadDemographicsFacet();
            if(facet == null)
            {
                return string.Empty;
            }

            return facet.AgeGroup;
        }

        public string GetGender()
        {
            var facet = ReadPersonalInformationFacet();
            if (facet == null)
            {
                return string.Empty;
            }

            return facet.Gender;
        }

        protected PersonalInformation ReadPersonalInformationFacet()
        {
            var trackerContact = ContactExtensions.GetCurrentTrackerContact();
            Assert.IsNotNull(trackerContact, "Current contact is null");

            var facets = trackerContact.GetXConnectFacets();

            if (!facets.ContainsKey(PersonalInformation.DefaultFacetKey))
            {
                return null;
            }

            if (facets[PersonalInformation.DefaultFacetKey] is PersonalInformation facet)
            {
                return facet;
            }

            return null;
        }

        protected DemographicsFacet ReadDemographicsFacet()
        {
            var trackerContact = ContactExtensions.GetCurrentTrackerContact();
            Assert.IsNotNull(trackerContact, "Current contact is null");

            var facets = trackerContact.GetXConnectFacets();

            if (!facets.ContainsKey(DemographicsFacet.DefaultKey))
            {
                return null;
            }

            if (facets[DemographicsFacet.DefaultKey] is DemographicsFacet facet)
            {
                return facet;
            }

            return null;
        }

        protected void UpdateGenderProfile(IDemographicsPayload data)
        {
            Tracker.Current.Interaction.Profiles.Remove("Gender");
            var genderScoring = new Dictionary<string, double>
            {
                { data.Gender, 10 }
            };
            Tracker.Current.Interaction.Profiles["Gender"].Score(genderScoring);
        }

        protected void UpdateAgeGroupProfile(IDemographicsPayload data)
        {
            Tracker.Current.Interaction.Profiles.Remove("Age Group");
            var ageGroupScoring = new Dictionary<string, double>
            {
                { data.AgeGroup, 10 }
            };
            Tracker.Current.Interaction.Profiles["Age Group"].Score(ageGroupScoring);
        }

        protected void UpdateAgeGroup(IDemographicsPayload data, Dictionary<string, Facet> facets)
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

        protected void UpdateGender(IDemographicsPayload data, Dictionary<string, Facet> facets)
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

        protected override void SetContactFacets(Dictionary<string, Facet> facets, XConnectClient client, IEntityReference<Contact> contactId)
        {
            var contact = client.Get<Contact>(contactId,
                new ContactExpandOptions(PersonalInformation.DefaultFacetKey, DemographicsFacet.DefaultKey));

            var personalFacet = GetFacetOrDefault(facets, PersonalInformation.DefaultFacetKey, contact, client);
            if (personalFacet is PersonalInformation personal)
            {
                client.SetPersonal(contact, personal);
            }

            var demographicsFacet = GetFacetOrDefault(facets, DemographicsFacet.DefaultKey, contact, client);
            if (demographicsFacet is DemographicsFacet demographics)
            {
                client.SetFacet(contact, DemographicsFacet.DefaultKey, demographics);
            }
        }
    }
}