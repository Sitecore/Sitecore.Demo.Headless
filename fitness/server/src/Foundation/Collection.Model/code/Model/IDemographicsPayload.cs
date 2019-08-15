namespace Sitecore.HabitatHome.Fitness.Foundation.Collection.Model.Model
{
    public interface IDemographicsPayload
    {
        string AgeGroup { get; set; }
        string Gender { get; set; }
        bool IsValid();
    }
}