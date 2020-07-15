using Sitecore.Demo.Fitness.Foundation.Analytics.Facets;
using Sitecore.Demo.Fitness.Foundation.Analytics.Model;

namespace Sitecore.Demo.Fitness.Foundation.Analytics.Services
{
    public interface ISportsService
    {
        void UpdateFacet(ISportPreferencesPayload data);
        void UpdateProfile(ISportPreferencesPayload data);
        SportsFacet ReadFacet();
    }
}