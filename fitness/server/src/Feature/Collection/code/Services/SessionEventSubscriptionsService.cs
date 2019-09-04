using System.Collections.Generic;
using Sitecore.Analytics.Tracking;
using Sitecore.Diagnostics;
using Sitecore.HabitatHome.Fitness.Foundation.Analytics.Services;

namespace Sitecore.HabitatHome.Fitness.Feature.Collection.Services
{
    /// <summary>
    /// This service allows for storage of sport event subscriptions in session
    /// </summary>
    public class SessionEventSubscriptionsService : ISessionEventSubscriptionsService
    {
        private readonly string attachmentKey = "event-subscriptions";

        public void Add([NotNull] string eventId)
        {
            var contact = ContactExtensions.GetCurrentTrackerContact();
            if (contact == null)
            {
                Log.Error("SessionEventSubscriptionsService terminates. Current contact was not resolved", this);
                return;
            }

            if (contact.Attachments.ContainsKey(attachmentKey))
            {
                var subscriptions = (List<string>)contact.Attachments[attachmentKey];
                if (!subscriptions.Contains(eventId))
                {
                    subscriptions.Add(eventId);
                }

                contact.Attachments[attachmentKey] = subscriptions;
            }
            else
            {
                contact.Attachments.Add(attachmentKey, new List<string> { eventId });
            }
        }

        public List<string> GetAll(Contact contact = null)
        {
            if(contact == null)
            {
                contact = ContactExtensions.GetCurrentTrackerContact();
            }
            if (contact == null)
            {
                Log.Error("SessionEventSubscriptionsService terminates. Current contact was not resolved", this);
                return new List<string>();
            }

            if (!contact.Attachments.ContainsKey(attachmentKey))
            {
                return new List<string>();
            }

            return (List<string>)contact.Attachments[attachmentKey];
        }
    }
}