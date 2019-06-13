using Sitecore.Diagnostics;
using Sitecore.XConnect;
using Sitecore.XConnect.Collection.Model;
using System.Collections.Generic;
using Sitecore.HabitatHome.Fitness.Collection.Model;
using Sitecore.HabitatHome.Fitness.Collection.Model.Facets;
using Sitecore.Analytics;
using Sitecore.XConnect.Client;

namespace Sitecore.HabitatHome.Fitness.Collection.Services
{
    public class DemographicsService : IDemographicsService
    {
        public void UpdateFacet([NotNull]DemographicsPayload data)
        {
            var trackerContact = ContactExtensions.GetCurrentTrackerContact();
            Assert.IsNotNull(trackerContact, "Current contact is null");

            var facets = trackerContact.GetXConnectFacets();

            UpdateAgeGroup(data, facets);
            UpdateGender(data, facets);

            trackerContact.UpdateXConnectFacets(facets);
        }

        public void UpdateProfile([NotNull]DemographicsPayload data)
        {
            UpdateGenderProfile(data);
            UpdateAgeGroupProfile(data);
        }

        public void SetFacet(IReadOnlyDictionary<string, Facet> facets, XConnectClient client, IEntityReference<Contact> contact)
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

        protected void UpdateGenderProfile(DemographicsPayload data)
        {
            Tracker.Current.Interaction.Profiles.Remove("Gender");
            var genderScoring = new Dictionary<string, double>
            {
                { data.Gender, 10 }
            };
            Tracker.Current.Interaction.Profiles["Gender"].Score(genderScoring);
        }

        protected void UpdateAgeGroupProfile(DemographicsPayload data)
        {
            Tracker.Current.Interaction.Profiles.Remove("Age Group");
            var ageGroupScoring = new Dictionary<string, double>
            {
                { data.AgeGroup, 10 }
            };
            Tracker.Current.Interaction.Profiles["Age Group"].Score(ageGroupScoring);
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
    }
}