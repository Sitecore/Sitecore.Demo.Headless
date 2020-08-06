using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Extensions.Logging;
using Sitecore.Framework.Conditions;
using Sitecore.Demo.Fitness.Feature.Automation.Services;
using Sitecore.Demo.Fitness.Foundation.Analytics;
using Sitecore.Demo.Fitness.Foundation.Analytics.Facets;
using Sitecore.Xdb.MarketingAutomation.Core.Activity;
using Sitecore.Xdb.MarketingAutomation.Core.Processing.Plan;

namespace Sitecore.Demo.Fitness.Feature.Automation.Activities
{
    public class SendPushNotification : IActivity
    {
        public IActivityServices Services { get; set; }

        public IEventNotificationService NotificationService { get; set; }

        protected ILogger<IActivity> Logger { get; set; }

        public SendPushNotification(IEventNotificationService notificationService, ILogger<SendPushNotification> logger)
        {
            Logger = logger;
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
                    this.Logger.LogError(ex, ex.ToString());
                    return new Failure($"SendPushNotification failed with '{ex.Message}'");
                }
            }

            return new Failure($"SendPushNotification failed. No subscription token was resolved for contact {context.Contact.Id}.");
        }
    }
}