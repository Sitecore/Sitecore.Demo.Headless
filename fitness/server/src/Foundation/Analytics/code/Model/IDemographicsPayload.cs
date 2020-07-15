namespace Sitecore.Demo.Fitness.Foundation.Analytics.Model
{
    public interface IDemographicsPayload
    {
        string AgeGroup { get; set; }
        string Gender { get; set; }
        bool IsValid();
    }
}