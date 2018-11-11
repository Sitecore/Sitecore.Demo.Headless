using System.Net;
using Sitecore.LayoutService.Mvc.Security;
using System.Web.Mvc;
using System;
using Sitecore.HabitatHome.Fitness.Collection.Model;
using Sitecore.HabitatHome.Fitness.Collection.Services;
using Sitecore.HabitatHome.Fitness.Collection.Filters;
using Sitecore.Diagnostics;

namespace Sitecore.HabitatHome.Fitness.Collection.Controllers.Subscriptions
{
    [RequireSscApiKey]
    [ImpersonateApiKeyUser]
    [EnableApiKeyCors]
    [SuppressFormsAuthenticationRedirect]
    public class HabitatFitnessSubscriptionsController : Controller
    {
        private IStringValueListFacetService facetService;
        private ISessionEventSubscriptionsService sessionEventSubscriptionsService;

        public HabitatFitnessSubscriptionsController([NotNull]IStringValueListFacetService facetService, [NotNull] ISessionEventSubscriptionsService sessionEventSubscriptionsService)
        {
            this.facetService = facetService;
            this.sessionEventSubscriptionsService = sessionEventSubscriptionsService;
        }

        [ActionName("subscribe")]
        [HttpPost]
        [CancelCurrentPage]
        public ActionResult Subscribe([System.Web.Http.FromBody]SubscribePayload data)
        {
            // TODO: move data validation
            if (!data.IsValid())
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest, "invalid data");
            }
            try
            {
                facetService.Add(data.Token, FacetIDs.SubscriptionTokens);
            }
            catch (Exception ex)
            {
                Log.Error($"Error adding '${FacetIDs.SubscriptionTokens}' facet value", ex, this);
                return new HttpStatusCodeResult(HttpStatusCode.InternalServerError, ex.Message);
            }

            try
            {
                facetService.Add(data.EventId, FacetIDs.Subscriptions);
                sessionEventSubscriptionsService.Add(data.EventId);
            }
            catch (Exception ex)
            {
                Log.Error($"Error adding '${FacetIDs.Subscriptions}' facet value", ex, this);
                return new HttpStatusCodeResult(HttpStatusCode.InternalServerError, ex.Message);
            }

            return new HttpStatusCodeResult(HttpStatusCode.OK);
        }

        [ActionName("unsubscribe")]
        [HttpPost]
        [CancelCurrentPage]
        public ActionResult UnSubscribe([System.Web.Http.FromBody]UnsubscribePayload data)
        {
            // TODO: move data validation
            if (!data.IsValid())
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest, "invalid data");
            }
            try
            {
                facetService.Remove(data.EventId, FacetIDs.Subscriptions);
            }
            catch (Exception ex)
            {
                Log.Error($"Unable to remove subscription for event {data.EventId} from the current contact facets", ex, this);
                return new HttpStatusCodeResult(HttpStatusCode.InternalServerError, ex.Message);

            }

            return new HttpStatusCodeResult(HttpStatusCode.OK);
        }

        [ActionName("unsubscribeall")]
        [HttpPost]
        [CancelCurrentPage]
        public ActionResult UnSubscribeAll()
        {
            try
            {
                facetService.RemoveAll(FacetIDs.Subscriptions);
                facetService.RemoveAll(FacetIDs.SubscriptionTokens);
            }
            catch (Exception ex)
            {
                Log.Error($"Unable to remove all notification subscription from the current contact facets", ex, this);
                return new HttpStatusCodeResult(HttpStatusCode.InternalServerError, ex.Message);

            }

            return new HttpStatusCodeResult(HttpStatusCode.OK);
        }
    }
}