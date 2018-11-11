using Sitecore.Analytics.Pipelines.CommitSession;
using Sitecore.Diagnostics;
using Sitecore.HabitatHome.Fitness.Collection.Model;
using Sitecore.HabitatHome.Fitness.Collection.Services;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Sitecore.HabitatHome.Fitness.Collection.Pipelines.CommitSession
{
    public class SendInitialEventSubscription : CommitSessionProcessor
    {
        private IEventNotificationService notificationService;
        private IStringValueListFacetService facetService;
        private ISessionEventSubscriptionsService sessionEventSubscriptionsService;

        public SendInitialEventSubscription([NotNull]IEventNotificationService notificationService, [NotNull]IStringValueListFacetService facetService, [NotNull] ISessionEventSubscriptionsService sessionEventSubscriptionsService)
        {
            this.notificationService = notificationService;
            this.facetService = facetService;
            this.sessionEventSubscriptionsService = sessionEventSubscriptionsService;
        }

        public override void Process(CommitSessionPipelineArgs args)
        {
            if (notificationService == null)
            {
                Log.Fatal("SendInitialEventSubscription cannot execute. IEventNotificationService instance required.", this);
                return;
            }

            if (facetService == null)
            {
                Log.Fatal("SendInitialEventSubscription cannot execute. IStringValueListFacetService instance required.", this);
                return;
            }

            if (sessionEventSubscriptionsService == null)
            {
                Log.Fatal("SendInitialEventSubscription cannot execute. ISessionEventSubscriptionsService instance required.", this);
                return;
            }

            var eventSubscriptions = sessionEventSubscriptionsService.GetAll(args.Session.Contact);
            if (!eventSubscriptions.Any())
            {
                return;
            }

            string[] tokens = facetService.GetFacetValues(FacetIDs.SubscriptionTokens, args.Session.Contact.GetXConnectFacets());
            // TODO: review this. Any notification token should work
            string token = tokens.FirstOrDefault();

            foreach (var eventSubscription in eventSubscriptions)
            {
                Task.Run(() => notificationService.SendInitialEventNotification(token, eventSubscription));
            }
        }
    }
}