using System;
using System.Net;
using System.Web.Mvc;
using Sitecore.Diagnostics;
using Sitecore.HabitatHome.Fitness.Foundation.Collection.Filters;
using Sitecore.HabitatHome.Fitness.Foundation.Collection.Model;
using Sitecore.HabitatHome.Fitness.Foundation.Collection.Services;
using Sitecore.LayoutService.Mvc.Security;

namespace Sitecore.HabitatHome.Fitness.Foundation.Collection.Controllers
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
                facetService.Add(data.EventIdFormatted, FacetIDs.Subscriptions);
                sessionEventSubscriptionsService.Add(data.EventIdFormatted);
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
        public ActionResult UnSubscribe([System.Web.Http.FromBody]EventPayload data)
        {
            // TODO: move data validation
            if (!data.IsValid())
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest, "invalid data");
            }
            try
            {
                facetService.Remove(data.EventIdFormatted, FacetIDs.Subscriptions);
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