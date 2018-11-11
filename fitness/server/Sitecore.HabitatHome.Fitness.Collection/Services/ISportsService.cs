using Sitecore.HabitatHome.Fitness.Collection.Model;
using Sitecore.XConnect;
using Sitecore.XConnect.Client;
using System.Collections.Generic;

namespace Sitecore.HabitatHome.Fitness.Collection.Services
{
    public interface ISportsService
    {
        void UpdateFacet(SportPreferencesPayload data);
        void UpdateProfile(SportPreferencesPayload data);
        void SetFacet(IReadOnlyDictionary<string, Facet> facets, XConnectClient client, IEntityReference<Contact> contact);
    }
}