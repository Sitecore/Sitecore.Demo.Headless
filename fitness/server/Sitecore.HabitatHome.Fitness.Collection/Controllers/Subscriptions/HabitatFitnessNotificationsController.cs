using System.Net;
using Sitecore.LayoutService.Mvc.Security;
using System.Web.Mvc;
using System;
using Sitecore.HabitatHome.Fitness.Collection.Model;
using Sitecore.HabitatHome.Fitness.Collection.Services;
using Sitecore.HabitatHome.Fitness.Collection.Filters;
using Sitecore.Diagnostics;
using Sitecore.HabitatHome.Fitness.Collection.Model.Facets;

namespace Sitecore.HabitatHome.Fitness.Collection.Controllers.Subscriptions
{
    [RequireSscApiKey]
    [ImpersonateApiKeyUser]
    [EnableApiKeyCors]
    [SuppressFormsAuthenticationRedirect]
    public class HabitatFitnessSubscriptionsController : Controller
    {
        private IStringValueListFacetService facetService;

        public HabitatFitnessSubscriptionsController([NotNull]IStringValueListFacetService facetService)
        {
            this.facetService = facetService;
        }

        [ActionName("subscribe")]
        [HttpPost]
        [CancelCurrentPage]
        public ActionResult Subscribe([System.Web.Http.FromBody]SubscriptionPayload data)
        {
            // TODO: move data validation
            if (!data.IsValid())
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest, "data no valid");
            }
            try
            {
                facetService.Add(data.SubscriptionId, NotificationSubscriptionsFacet.DefaultKey);
            }
            catch (Exception ex)
            {
                Log.Error($"Unable to add subscription {data.SubscriptionId} to current contact facets", ex, this);
                return new HttpStatusCodeResult(HttpStatusCode.InternalServerError, ex.Message);
            }

            return new HttpStatusCodeResult(HttpStatusCode.OK);
        }

        [ActionName("unsubscribe")]
        [HttpPost]
        [CancelCurrentPage]
        public ActionResult UnSubscribe([System.Web.Http.FromBody]SubscriptionPayload data)
        {
            // TODO: move data validation
            if (!data.IsValid())
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest, "data no valid");
            }
            try
            {
                facetService.Remove(data.SubscriptionId, NotificationSubscriptionsFacet.DefaultKey);
            }
            catch (Exception ex)
            {
                Log.Error($"Unable to remove subscription {data.SubscriptionId} from the current contact facets", ex, this);
                return new HttpStatusCodeResult(HttpStatusCode.InternalServerError, ex.Message);

            }

            return new HttpStatusCodeResult(HttpStatusCode.OK);
        }
    }
}