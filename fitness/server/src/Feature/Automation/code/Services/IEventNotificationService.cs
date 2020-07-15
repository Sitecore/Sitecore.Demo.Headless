using Sitecore.XConnect;

namespace Sitecore.Demo.Fitness.Feature.Automation.Services
{
    public interface IEventNotificationService
    {
        void SendInitialEventNotification(Contact contact, string title, string body, string token);
    }
}