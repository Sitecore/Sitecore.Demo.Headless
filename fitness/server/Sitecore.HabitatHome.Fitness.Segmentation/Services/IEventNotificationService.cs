using Sitecore.XConnect;

namespace Sitecore.HabitatHome.Fitness.Segmentation.Services
{
    public interface IEventNotificationService
    {
        void SendInitialEventNotification(Contact contact, string token);
    }
}