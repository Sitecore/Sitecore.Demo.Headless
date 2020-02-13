using Sitecore.HabitatHome.Fitness.Foundation.Analytics.Facets;
using Sitecore.HabitatHome.Fitness.Foundation.Analytics.Model;

namespace Sitecore.HabitatHome.Fitness.Foundation.Analytics.Services
{
    public interface ISportsService
    {
        void UpdateFacet(ISportPreferencesPayload data);
        void UpdateProfile(ISportPreferencesPayload data);
        SportsFacet ReadFacet();
    }
}