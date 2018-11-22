using Sitecore.Framework.Conditions;
using Sitecore.HabitatHome.Fitness.Automation.Services;
using Sitecore.HabitatHome.Fitness.Collection.Model;
using Sitecore.XConnect;
using Sitecore.Xdb.MarketingAutomation.Core.Activity;
using Sitecore.Xdb.MarketingAutomation.Core.Processing.Plan;
using System.Collections.Generic;
using System.Linq;

namespace Sitecore.HabitatHome.Fitness.Automation.Activities
{
    public class SendPushNotification : IActivity
    {
        public IActivityServices Services { get; set; }

        public ActivityResult Invoke(IContactProcessingContext context)
        {
            Condition.Requires(context.Contact).IsNotNull();

            var subscriptionFacet = context.Contact.GetFacet<UntypedFacet>(FacetIDs.Subscriptions);
            var eventSubscriptions = new List<string>();
            if (subscriptionFacet != null)
            {
                foreach(var xValue in (XCollection)subscriptionFacet.XObject["Values"])
                {
                    eventSubscriptions.Add((string)xValue);
                }
            }

            var tokenFacet = context.Contact.GetFacet<UntypedFacet>(FacetIDs.SubscriptionTokens);
            var tokens = new List<string>();
            if (tokenFacet != null)
            {
                foreach (var xValue in (XCollection)tokenFacet.XObject["Values"])
                {
                    tokens.Add((string)xValue);
                }
            }

            var token = tokens.FirstOrDefault();
            IEventNotificationService notificationService = new EventNotificationService();

            foreach (var eventSubscription in eventSubscriptions)
            {
                notificationService.SendInitialEventNotification(context.Contact, token);
            }

            return new SuccessMove();
        }
    }
}