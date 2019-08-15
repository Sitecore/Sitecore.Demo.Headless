using System.Collections.Generic;
using Sitecore.HabitatHome.Fitness.Foundation.Collection.Model.Model;
using Sitecore.XConnect;
using Sitecore.XConnect.Client;

namespace Sitecore.HabitatHome.Fitness.Foundation.Collection.Model.Services
{
    public interface IIdentificationService
    {
        void UpdateFacet(IIdentificationPayload data);
        void SetEmailFacet(IReadOnlyDictionary<string, Facet> facets, XConnectClient client, IEntityReference<Contact> contact);
        void SetPersonalFacet(IReadOnlyDictionary<string, Facet> facets, XConnectClient client, IEntityReference<Contact> contact);
    }
}