using Sitecore.Diagnostics;

namespace Sitecore.HabitatHome.Fitness.Collection.Services
{
    public class EmailService : IEmailService
    {
        public bool SendAppInviteEmail(string hostName, string email, string alias)
        {
            Log.Info($"{hostName}?alias={alias}", this);
            return true;
        }
    }
}