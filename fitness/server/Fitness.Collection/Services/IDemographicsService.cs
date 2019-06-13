using Sitecore.HabitatHome.Fitness.Collection.Model;
using Sitecore.XConnect;
using Sitecore.XConnect.Client;
using System.Collections.Generic;

namespace Sitecore.HabitatHome.Fitness.Collection.Services
{
    public interface IDemographicsService
    {
        void UpdateFacet(DemographicsPayload data);
        void UpdateProfile(DemographicsPayload data);
        void SetFacet(IReadOnlyDictionary<string, Facet> facets, XConnectClient client, IEntityReference<Contact> contact);
        string GetAgeGroup();
        string GetGender();
    }
}