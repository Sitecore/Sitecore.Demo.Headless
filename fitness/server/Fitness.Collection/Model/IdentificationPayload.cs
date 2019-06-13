namespace Sitecore.HabitatHome.Fitness.Collection.Model
{
    public class IdentificationPayload
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