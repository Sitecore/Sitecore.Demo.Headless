namespace Sitecore.HabitatHome.Fitness.Collection.Model
{
    public class EventPayload
    {
        public string EventId { get; set; }

        // TODO: move model validation to action attribute
        public bool IsValid()
        {
            return !string.IsNullOrWhiteSpace(EventId);
        }
    }
}