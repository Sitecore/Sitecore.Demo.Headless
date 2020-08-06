using System;
using System.Net;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json.Linq;
using Sitecore.Framework.Conditions;
using Sitecore.XConnect;
using Sitecore.XConnect.Collection.Model;

namespace Sitecore.Demo.Fitness.Feature.Automation.Services
{
    public class EventNotificationServiceOptions
    {
        public string FirebaseMessagingApiUri { get; set; }
    }

    public class EventNotificationService : IEventNotificationService
    {
        public string FirebaseMessagingApiUri { get; set; }

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
                client.Headers.Add("Authorization", $"key={Environment.GetEnvironmentVariable("REACT_APP_FIREBASE_MESSAGING_SERVER_KEY")}");

                dynamic data = new JObject();
                data.notification = new JObject();
                data.notification.title = title.Replace("$first_name$", GetCurrentContactName(contact));
                data.notification.body = body.Replace("$first_name$", GetCurrentContactName(contact));
                data.notification.click_action = Environment.GetEnvironmentVariable("REACT_APP_PUBLIC_HOST_NAME");
                data.notification.icon = $"{Environment.GetEnvironmentVariable("REACT_APP_PUBLIC_HOST_NAME")}/favicon-32x32.png";
                data.to = token;

                client.UploadString(uri, data.ToString());
            }
        }

        private void BindPropertiesFromOptions(EventNotificationServiceOptions options)
        {
            Condition.Requires(options, nameof(options)).IsNotNull();
            this.FirebaseMessagingApiUri = options.FirebaseMessagingApiUri;
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