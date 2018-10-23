using Sitecore.Analytics;
using Sitecore.HabitatHome.Fitness.Collection.Model;
using Sitecore.HabitatHome.Fitness.Collection.Model.Facets;
using System.Collections.Generic;
using System.Linq;

namespace Sitecore.HabitatHome.Fitness.Collection.Services
{
    public class ProfileUpdateService : IProfileUpdateService
    {
        public void UpdateDemographicsProfile(DemographicsPayload data)
        {
            UpdateGenderProfile(data);
            UpdateAgeGroupProfile(data);
        }

        public void UpdateSportsProfile(SportPreferencesPayload data)
        {
            Tracker.Current.Interaction.Profiles.Remove(SportsFacet.DefaultKey);
            Tracker.Current.Interaction.Profiles[SportsFacet.DefaultKey].Score(data.Ratings.ToDictionary(kvp => kvp.Key, kvp => (double)kvp.Value));
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
    }
}