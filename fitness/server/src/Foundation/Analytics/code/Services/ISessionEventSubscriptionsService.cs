using System.Collections.Generic;
using Sitecore.Analytics.Tracking;

namespace Sitecore.HabitatHome.Fitness.Foundation.Analytics.Services
{
    public interface ISessionEventSubscriptionsService
    {
        void Add(string eventId);
        List<string> GetAll(Contact contact);
    }
}