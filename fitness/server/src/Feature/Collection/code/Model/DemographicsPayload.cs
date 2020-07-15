using Sitecore.Demo.Fitness.Foundation.Analytics.Model;

namespace Sitecore.Demo.Fitness.Feature.Collection.Model
{
    public class DemographicsPayload : IDemographicsPayload
    {
        public string AgeGroup { get; set; }
        public string Gender { get; set; }

        // TODO: move model validation to action attribute
        public bool IsValid()
        {
            return !string.IsNullOrWhiteSpace(AgeGroup) && !string.IsNullOrWhiteSpace(Gender);
        }
    }
}