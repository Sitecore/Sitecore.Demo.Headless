using Sitecore.DependencyInjection;
using Sitecore.Framework.Conditions;
using Sitecore.HabitatHome.Fitness.Automation.Services;
using Sitecore.HabitatHome.Fitness.Collection.Model;
using Sitecore.HabitatHome.Fitness.Collection.Model.Facets;
using Sitecore.Xdb.MarketingAutomation.Core.Activity;
using Sitecore.Xdb.MarketingAutomation.Core.Processing.Plan;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Sitecore.HabitatHome.Fitness.Automation.Activities
{
    public class SendPushNotification : IActivity
    {
        public IActivityServices Services { get; set; }

        public IEventNotificationService NotificationService { get; set; }

        public SendPushNotification(IEventNotificationService notificationService)
        {
            NotificationService = notificationService;
        }

        public string Title { get; set; }

        public string Body { get; set; }

        public ActivityResult Invoke(IContactProcessingContext context)
        {
            Condition.Requires(context.Contact).IsNotNull();
            Condition.Requires(NotificationService).IsNotNull();

            var tokens = new List<string>();
            var tokenFacet = context.Contact.GetFacet<StringValueListFacet>(FacetIDs.SubscriptionTokens);
            if (tokenFacet != null)
            {
                var token = tokenFacet.Values.FirstOrDefault();

                try
                {
                    NotificationService.SendInitialEventNotification(context.Contact, Title, Body, token);
                    return new SuccessMove();
                }
                catch (Exception ex)
                {
                    return new Failure($"SendPushNotification failed with '{ex.Message}'");
                }
            }

            return new Failure($"SendPushNotification failed. No subscription token was resolved for contact {context.Contact.Id}.");
        }
    }
}