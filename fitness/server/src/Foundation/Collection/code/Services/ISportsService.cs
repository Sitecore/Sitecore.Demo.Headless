using Sitecore.HabitatHome.Fitness.Foundation.Collection.Model.Facets;
using Sitecore.XConnect;
using Sitecore.XConnect.Client;
using System.Collections.Generic;
using Sitecore.HabitatHome.Fitness.Foundation.Collection.Model;

namespace Sitecore.HabitatHome.Fitness.Foundation.Collection.Services
{
    public interface ISportsService
    {
        void UpdateFacet(SportPreferencesPayload data);
        void UpdateProfile(SportPreferencesPayload data);
        SportsFacet ReadFacet();
        void SetFacet(IReadOnlyDictionary<string, Facet> facets, XConnectClient client, IEntityReference<Contact> contact);
    }
}