using System.Collections.Generic;
using Sitecore.HabitatHome.Fitness.Foundation.Analytics.Facets;
using Sitecore.HabitatHome.Fitness.Foundation.Analytics.Model;
using Sitecore.XConnect;
using Sitecore.XConnect.Client;

namespace Sitecore.HabitatHome.Fitness.Foundation.Analytics.Services
{
    public interface ISportsService
    {
        void UpdateFacet(ISportPreferencesPayload data);
        void UpdateProfile(ISportPreferencesPayload data);
        SportsFacet ReadFacet();
        void SetFacet(IReadOnlyDictionary<string, Facet> facets, XConnectClient client, IEntityReference<Contact> contact);
    }
}