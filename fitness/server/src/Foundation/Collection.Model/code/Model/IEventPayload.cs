namespace Sitecore.HabitatHome.Fitness.Foundation.Collection.Model.Model
{
    public interface IEventPayload
    {
        string EventId { get; set; }
        string EventIdFormatted { get; }
        bool IsValid();
    }
}