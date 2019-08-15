namespace Sitecore.HabitatHome.Fitness.Foundation.Collection.Model.Model
{
    public interface ISubscribePayload
    {
        string Token { get; set; }
        string EventId { get; set; }
        string EventIdFormatted { get; }
        bool IsValid();
    }
}