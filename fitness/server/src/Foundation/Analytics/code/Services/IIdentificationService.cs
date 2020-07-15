using System.Collections.Generic;
using Sitecore.Demo.Fitness.Foundation.Analytics.Model;
using Sitecore.XConnect;
using Sitecore.XConnect.Client;

namespace Sitecore.Demo.Fitness.Foundation.Analytics.Services
{
    public interface IIdentificationService
    {
        void UpdateFacet(IIdentificationPayload data);
    }
}