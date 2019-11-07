using System.Collections.Generic;
using Sitecore.HabitatHome.Fitness.Foundation.Analytics.Model;
using Sitecore.XConnect;
using Sitecore.XConnect.Client;

namespace Sitecore.HabitatHome.Fitness.Foundation.Analytics.Services
{
    public interface IIdentificationService
    {
        void UpdateFacet(IIdentificationPayload data);
        void SetEmailFacet(Facet facet, XConnectClient client, IEntityReference<Contact> contact);
        void SetPersonalFacet(Facet facet, XConnectClient client, IEntityReference<Contact> contact);
    }
}