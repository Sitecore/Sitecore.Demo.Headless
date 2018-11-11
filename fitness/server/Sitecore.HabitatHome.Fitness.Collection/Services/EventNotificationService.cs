using Newtonsoft.Json.Linq;
using Sitecore.Configuration;
using Sitecore.Diagnostics;
using Sitecore.XConnect.Collection.Model;
using System;
using System.Net;

namespace Sitecore.HabitatHome.Fitness.Collection.Services
{
    // TODO: this is a WIP service. The contract of this service will change
    public class EventNotificationService : IEventNotificationService
    {
        public EventNotificationService()
        {

        }

        public void SendInitialEventNotification([NotNull]string token, [NotNull] string eventId)
        {
            // TODO: make db name configurable extract event info
            var eventItem = Factory.GetDatabase("master").GetItem(eventId);
            if (eventItem == null)
            {
                Log.Error($"EventNotificationService cannot send notification, event ${eventId} not found", this);
            }

            // TODO: this will be reviewed after MA integration
            var eventName = eventItem["name"];

            var uri = new Uri(Config.FirebaseMessagingApiUri);
            WebClient client = new WebClient();
            client.Headers.Add("Content-Type", "application/json");
            client.Headers.Add("Authorization", $"key={Config.FirebaseMessagingApiKey}");

            dynamic data = new JObject();
            data.notification = new JObject();
            data.notification.title = $"Hey {GetCurrentContactName()}!";
            data.notification.body = $"Thanks for registering to {eventName}, it will be outstanding.";
            data.notification.click_action = $"{Config.PublicHostName}/events/{eventItem.Name}";
            data.notification.icon = $"{Config.PublicHostName}/favicon-32x32.png";
            data.to = token;

            try
            {
                var result = client.UploadString(uri, data.ToString());
            }
            catch (Exception ex)
            {
                Log.Error("SendInitialEventNotification failed", ex, this);
            }
        }

        // TODO: this is temporary. The contract of this service will change
        public void Send24HEventNotifications()
        {
            // iterate over events and send notifications to all subscribers
            // if it's less than 24 hours before the event
            // need to persist which notification were sent already so it doesn't spam :)
        }

        private string GetCurrentContactName()
        {
            var contact = ContactExtensions.GetCurrentTrackerContact();
            if (contact == null)
            {
                return string.Empty;
            }

            var facets = contact.GetXConnectFacets();

            if (facets.ContainsKey(PersonalInformation.DefaultFacetKey))
            {
                var personalInfo = (PersonalInformation)facets[PersonalInformation.DefaultFacetKey];
                return personalInfo.FirstName;
            }

            return string.Empty;
        }
    }
}