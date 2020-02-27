using Sitecore.HabitatHome.Fitness.Foundation.Analytics.Model;

namespace Sitecore.HabitatHome.Fitness.Foundation.Analytics.Services
{
    public interface IDemographicsService
    {
        void UpdateFacet(IDemographicsPayload data);
        void UpdateProfile(IDemographicsPayload data);
        string GetAgeGroup();
        string GetGender();
    }
}