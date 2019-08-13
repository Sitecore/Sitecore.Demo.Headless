using Sitecore.XConnect;

namespace Sitecore.HabitatHome.Fitness.Feature.Automation.Services
{
    public interface IEventNotificationService
    {
        void SendInitialEventNotification(Contact contact, string title, string body, string token);
    }
}