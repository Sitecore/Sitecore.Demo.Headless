using System.Net;
using System.Net.Http;
using Sitecore.LayoutService.Mvc.Security;
using System.Web.Mvc;
using System;
using Sitecore.HabitatHome.Fitness.Collection.Model;
using Sitecore.HabitatHome.Fitness.Collection.Services;
using Sitecore.HabitatHome.Fitness.Collection.Filters;
using Sitecore.Diagnostics;

namespace Sitecore.HabitatHome.Fitness.Collection.Controllers.Events
{
    [RequireSscApiKey]
    [ImpersonateApiKeyUser]
    [EnableApiKeyCors]
    [SuppressFormsAuthenticationRedirect]
    public class HabitatFitnessEventFavoritesController : Controller
    {
        private IFacetUpdateService facetUpdateService;

        public HabitatFitnessEventFavoritesController([NotNull]IFacetUpdateService facetUpdateService)
        {
            this.facetUpdateService = facetUpdateService;
        }

        [ActionName("add")]
        [HttpPost]
        [CancelCurrentPage]
        public ActionResult Add([System.Web.Http.FromBody]EventPayload data)
        {
            try
            {
                facetUpdateService.AddEventToFavoritesFacet(data);
            }
            catch (Exception ex)
            {
                Log.Error($"Unable to add event id {data.EventId} to current contact facets", ex, this);
                return new HttpStatusCodeResult(HttpStatusCode.InternalServerError, ex.Message);
            }

            return new HttpStatusCodeResult(HttpStatusCode.OK);
        }

        [ActionName("remove")]
        [HttpPost]
        [CancelCurrentPage]
        public ActionResult Remove([System.Web.Http.FromBody]EventPayload data)
        {
            try
            {
                facetUpdateService.RemoveEventToFavoritesFacet(data);
            }
            catch (Exception ex)
            {
                Log.Error($"Unable to remove event id {data.EventId} from the current contact facets", ex, this);
                return new HttpStatusCodeResult(HttpStatusCode.InternalServerError, ex.Message);

            }

            return new HttpStatusCodeResult(HttpStatusCode.OK);
        }
    }
}