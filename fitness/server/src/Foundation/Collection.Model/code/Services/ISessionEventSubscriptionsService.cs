using System.Collections.Generic;
using Sitecore.Analytics.Tracking;

namespace Sitecore.HabitatHome.Fitness.Foundation.Collection.Model.Services
{
    public interface ISessionEventSubscriptionsService
    {
        void Add(string eventId);
        List<string> GetAll(Contact contact);
    }
}