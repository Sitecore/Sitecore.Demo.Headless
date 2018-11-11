namespace Sitecore.HabitatHome.Fitness.Collection.Services
{
    public interface IEventNotificationService
    {
        void SendInitialEventNotification(string token, string eventId);
    }
}