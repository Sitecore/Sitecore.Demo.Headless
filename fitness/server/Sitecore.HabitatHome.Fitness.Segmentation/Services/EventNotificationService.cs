using Newtonsoft.Json.Linq;
using Sitecore.XConnect;
using Sitecore.XConnect.Collection.Model;
using System;
using System.Net;

namespace Sitecore.HabitatHome.Fitness.Segmentation.Services
{
    // TODO: this is a WIP service. The contract of this service will change
    public class EventNotificationService : IEventNotificationService
    {
        public void SendInitialEventNotification(Contact contact, string token)
        {
            var uri = new Uri("INSERT-API-ENDPOINT-HERE");
            using (var client = new WebClient())
            {
                client.Headers.Add("Content-Type", "application/json");
                client.Headers.Add("Authorization", $"key=INSERT-KEY-HERE");

                dynamic data = new JObject();
                data.notification = new JObject();
                data.notification.title = $"Hey {GetCurrentContactName(contact)}!";
                data.notification.body = $"Thanks for registering for the event, it will be outstanding.";
                data.notification.click_action = $"http://localhost:3000";
                data.notification.icon = $"http://localhost:3000/favicon-32x32.png";
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

        private string GetCurrentContactName(Contact contact)
        {
            // TODO: get contact first name - this errors out now
            //var facets = contact.GetFacet<PersonalInformation>(PersonalInformation.DefaultFacetKey);
            return "Visitor";
        }
    }
}