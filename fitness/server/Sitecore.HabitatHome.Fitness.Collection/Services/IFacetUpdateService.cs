using Sitecore.HabitatHome.Fitness.Collection.Model;

namespace Sitecore.HabitatHome.Fitness.Collection.Services
{
    public interface IFacetUpdateService
    {
        void UpdateDemographicsFacet(DemographicsPayload data);

        void UpdateSportsFacet(SportPreferencesPayload data);

        void UpdateIdentificationFacet(IdentificationPayload data);

        void AddEventToFavoritesFacet(EventPayload data);

        void RemoveEventToFavoritesFacet(EventPayload data);

        void AddEventRegistrationFacet(EventPayload data);

        void RemoveEventRegistrationFacet(EventPayload data);
    }
}