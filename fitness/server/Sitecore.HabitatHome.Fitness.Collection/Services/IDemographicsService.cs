using Sitecore.HabitatHome.Fitness.Collection.Model;

namespace Sitecore.HabitatHome.Fitness.Collection.Services
{
    public interface IDemographicsService
    {
        void UpdateFacet(DemographicsPayload data);
        void UpdateProfile(DemographicsPayload data);
    }
}