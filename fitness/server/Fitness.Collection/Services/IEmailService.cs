namespace Sitecore.HabitatHome.Fitness.Collection.Services
{
    public interface IEmailService
    {
        bool SendAppInviteEmail(string hostName, string email, string name, string alias);
    }
}