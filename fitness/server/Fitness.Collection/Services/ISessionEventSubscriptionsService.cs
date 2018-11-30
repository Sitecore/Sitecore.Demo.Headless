using Sitecore.Analytics.Tracking;
using System.Collections.Generic;

namespace Sitecore.HabitatHome.Fitness.Collection.Services
{
    public interface ISessionEventSubscriptionsService
    {
        void Add(string eventId);
        List<string> GetAll(Contact contact);
    }
}