namespace Sitecore.HabitatHome.Fitness.Collection.Model
{
    public class SubscribePayload
    {
        public string Token { get; set; }

        public string EventId { get; set; }

        // TODO: move model validation to action attribute
        public bool IsValid()
        {
            return !string.IsNullOrWhiteSpace(Token) || !string.IsNullOrWhiteSpace(EventId);
        }
    }
}