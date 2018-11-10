namespace Sitecore.HabitatHome.Fitness.Collection.Model
{
    public class SubscriptionPayload
    {
        public string SubscriptionId { get; set; }

        // TODO: move model validation to action attribute
        public bool IsValid()
        {
            return !string.IsNullOrWhiteSpace(SubscriptionId);
        }
    }
}