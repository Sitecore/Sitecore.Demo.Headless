using Sitecore.HabitatHome.Fitness.Collection.Model;
using Sitecore.XConnect;
using Sitecore.XConnect.Client;
using System.Collections.Generic;

namespace Sitecore.HabitatHome.Fitness.Collection.Services
{
    public interface IIdentificationService
    {
        void UpdateFacet(IdentificationPayload data);
        void SetEmailFacet(IReadOnlyDictionary<string, Facet> facets, XConnectClient client, IEntityReference<Contact> contact);
        void SetPersonalFacet(IReadOnlyDictionary<string, Facet> facets, XConnectClient client, IEntityReference<Contact> contact);
    }
}