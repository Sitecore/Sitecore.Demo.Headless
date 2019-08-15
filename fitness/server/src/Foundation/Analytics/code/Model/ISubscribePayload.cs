namespace Sitecore.HabitatHome.Fitness.Foundation.Analytics.Model
{
    public interface ISubscribePayload
    {
        string Token { get; set; }
        string EventId { get; set; }
        string EventIdFormatted { get; }
        bool IsValid();
    }
}