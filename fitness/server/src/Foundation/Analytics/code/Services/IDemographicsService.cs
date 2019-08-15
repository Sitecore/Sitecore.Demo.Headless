using System.Collections.Generic;
using Sitecore.HabitatHome.Fitness.Foundation.Analytics.Model;
using Sitecore.XConnect;
using Sitecore.XConnect.Client;

namespace Sitecore.HabitatHome.Fitness.Foundation.Analytics.Services
{
    public interface IDemographicsService
    {
        void UpdateFacet(IDemographicsPayload data);
        void UpdateProfile(IDemographicsPayload data);
        void SetFacet(IReadOnlyDictionary<string, Facet> facets, XConnectClient client, IEntityReference<Contact> contact);
        string GetAgeGroup();
        string GetGender();
    }
}