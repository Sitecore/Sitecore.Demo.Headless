namespace Sitecore.HabitatHome.Fitness.Collection.Model
{
    public class DemographicsPayload
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