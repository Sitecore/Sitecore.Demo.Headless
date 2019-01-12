using SendGrid;
using SendGrid.Helpers.Mail;
using Sitecore.Diagnostics;

namespace Sitecore.HabitatHome.Fitness.Collection.Services
{
    /// <summary>
    /// Temporary implementation of Email Service using SendGrid
    /// </summary>
    public class EmailService : IEmailService
    {
        public bool SendAppInviteEmail(string hostName, string email, string name, string alias)
        {
            var apiKey = Settings.EmailApiKey;
            if (string.IsNullOrWhiteSpace(apiKey))
            {
                Log.Fatal("API key for email service is not configured.", this);
                return false;
            }

            var client = new SendGridClient(apiKey);
            var from = new EmailAddress("habitatfitness@sitecore.com");
            var subject = $"{name}, thanks for registering!";
            var to = new EmailAddress(email);
            var plainTextContent = $"Check out our progressive mobile app: {hostName}?alias={alias}";

            var htmlContent = $"Check out our progressive mobile app! <a href=\"{hostName}?alias={alias}\">access mobile app</a>";
            var msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent, htmlContent);
            var response = client.SendEmailAsync(msg).ConfigureAwait(false).GetAwaiter().GetResult();

            if (response != null)
            {
                return response.StatusCode == System.Net.HttpStatusCode.Accepted ? true : false;
            }

            return false;
        }
    }
}