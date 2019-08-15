using Sitecore.HabitatHome.Fitness.Foundation.Analytics.Model;

namespace Sitecore.HabitatHome.Fitness.Feature.Collection.Model
{
    public class IdentificationPayload : IIdentificationPayload
    {
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }

        public bool IsValid()
        {
            return !string.IsNullOrWhiteSpace(Email);
        }
    }
}