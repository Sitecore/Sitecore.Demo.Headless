using Sitecore.HabitatHome.Fitness.Collection.Model;

namespace Sitecore.HabitatHome.Fitness.Collection.Services
{
    public interface IProfileUpdateService
    {
        void UpdateDemographicsProfile(DemographicsPayload data);

        void UpdateSportsProfile(SportPreferencesPayload data);
    }
}