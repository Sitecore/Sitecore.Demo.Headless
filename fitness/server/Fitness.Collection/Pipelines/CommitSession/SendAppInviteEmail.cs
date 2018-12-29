using Sitecore.Analytics.Pipelines.CommitSession;
using Sitecore.Diagnostics;
using Sitecore.HabitatHome.Fitness.Collection.Services;
using Sitecore.XConnect;
using Sitecore.XConnect.Client.Configuration;
using Sitecore.XConnect.Collection.Model;
using System.Linq;

namespace Sitecore.HabitatHome.Fitness.Collection.Pipelines.CommitSession
{
    public class SendAppInviteEmail : CommitSessionProcessor
    {
        private readonly IEmailService emailService;

        public SendAppInviteEmail([NotNull] IEmailService emailService)
        {
            this.emailService = emailService;
        }

        public override void Process(CommitSessionPipelineArgs args)
        {
            var contactId = args.Session.Contact.ContactId;

            using (var client = SitecoreXConnectClientConfiguration.GetClient())
            {
                try
                {
                    var contact = client.GetContactFromTrackerId(contactId, new ExpandOptions(EmailAddressList.DefaultFacetKey));
                    if (contact != null)
                    {
                        var alias = contact.Identifiers.FirstOrDefault(i => i.Source == "Alias");
                        var email = contact.GetPreferredEmail();

                        if (!string.IsNullOrEmpty(alias.Identifier) && !string.IsNullOrEmpty(email))
                        {
                            emailService.SendAppInviteEmail("http://localhost:3000", email, alias.Identifier);
                        }
                        else
                        {
                            Log.Fatal("SendAppInviteEmail unable to send app invite email, missing required data", this);
                        }
                    }
                }
                catch (XdbExecutionException ex)
                {
                    Log.Error("SendAppInviteEmail failed miserably.", ex, this);
                }
            }
        }
    }
}