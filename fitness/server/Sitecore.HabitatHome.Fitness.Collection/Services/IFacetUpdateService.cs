using Sitecore.HabitatHome.Fitness.Collection.Model;

namespace Sitecore.HabitatHome.Fitness.Collection.Services
{
    public interface IFacetUpdateService
    {
        void UpdateDemographicsFacet(DemographicsPayload data);

        void UpdateSportsFacet(SportPreferencesPayload data);

        void UpdateIdentificationFacet(IdentificationPayload data);

        void UpdateEventFavoritesFacet(EventPayload data);

        void UpdateEventRegistrationFacet(EventPayload data);
    }
}