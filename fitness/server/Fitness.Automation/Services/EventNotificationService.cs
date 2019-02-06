using Microsoft.Extensions.Configuration;
using Newtonsoft.Json.Linq;
using Sitecore.Framework.Conditions;
using Sitecore.XConnect;
using Sitecore.XConnect.Collection.Model;
using System;
using System.Net;

namespace Sitecore.HabitatHome.Fitness.Automation.Services
{
    public class EventNotificationServiceOptions
    {
        public string FirebaseMessagingApiUri { get; set; }

        public string FirebaseMessagingApiKey { get; set; }

        public string PublicHostName { get; set; }
    }

    public class EventNotificationService : IEventNotificationService
    {
        public string FirebaseMessagingApiUri { get; set; }

        public string FirebaseMessagingApiKey { get; set; }

        public string PublicHostName { get; set; }

        public EventNotificationService(IConfiguration configuration)
        {
            Condition.Requires(configuration, nameof(configuration)).IsNotNull();
            this.BindPropertiesFromOptions(configuration.As<EventNotificationServiceOptions>());
        }

        public EventNotificationService(EventNotificationServiceOptions options)
        {
            BindPropertiesFromOptions(options);
        }

        public void SendInitialEventNotification(Contact contact, string title, string body, string token)
        {
            var uri = new Uri(FirebaseMessagingApiUri);
            using (var client = new WebClient())
            {
                client.Headers.Add("Content-Type", "application/json");
                client.Headers.Add("Authorization", $"key={FirebaseMessagingApiKey}");

                dynamic data = new JObject();
                data.notification = new JObject();
                data.notification.title = title.Replace("$first_name$", GetCurrentContactName(contact));
                data.notification.body = body.Replace("$first_name$", GetCurrentContactName(contact));
                data.notification.click_action = PublicHostName;
                data.notification.icon = $"{PublicHostName}/favicon-32x32.png";
                data.to = token;

                try
                {
                    var result = client.UploadString(uri, data.ToString());
                }
                catch (Exception ex)
                {
                    // TODO: inject logger here.
                }
            }
        }

        private void BindPropertiesFromOptions(EventNotificationServiceOptions options)
        {
            Condition.Requires(options, nameof(options)).IsNotNull();
            this.FirebaseMessagingApiUri = options.FirebaseMessagingApiUri;
            this.FirebaseMessagingApiKey = options.FirebaseMessagingApiKey;
            this.PublicHostName = options.PublicHostName;
        }

        private string GetCurrentContactName(Contact contact)
        {
            var personalInfoFacet = contact.GetFacet<PersonalInformation>(PersonalInformation.DefaultFacetKey);
            if (personalInfoFacet != null)
            {
                return personalInfoFacet.FirstName;
            }

            return "Visitor";
        }
    }
}