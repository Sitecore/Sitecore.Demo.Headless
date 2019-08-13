using Sitecore.XConnect;
using Sitecore.XConnect.Client;
using System.Collections.Generic;
using Sitecore.HabitatHome.Fitness.Foundation.Collection.Model;

namespace Sitecore.HabitatHome.Fitness.Foundation.Collection.Services
{
    public interface IIdentificationService
    {
        void UpdateFacet(IdentificationPayload data);
        void SetEmailFacet(IReadOnlyDictionary<string, Facet> facets, XConnectClient client, IEntityReference<Contact> contact);
        void SetPersonalFacet(IReadOnlyDictionary<string, Facet> facets, XConnectClient client, IEntityReference<Contact> contact);
    }
}