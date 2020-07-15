namespace Sitecore.Demo.Fitness.Foundation.Analytics.Model
{
    public interface IIdentificationPayload
    {
        string Email { get; set; }
        string FirstName { get; set; }
        string LastName { get; set; }
        bool IsValid();
    }
}