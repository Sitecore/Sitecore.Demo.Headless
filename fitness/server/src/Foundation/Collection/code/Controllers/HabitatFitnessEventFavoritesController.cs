using System.Net;
using System.Net.Http;
using Sitecore.LayoutService.Mvc.Security;
using System.Web.Mvc;
using System;
using Sitecore.HabitatHome.Fitness.Foundation.Collection.Model;
using Sitecore.Diagnostics;
using Sitecore.HabitatHome.Fitness.Foundation.Collection.Filters;
using Sitecore.HabitatHome.Fitness.Foundation.Collection.Services;

namespace Sitecore.HabitatHome.Fitness.Foundation.Collection.Controllers
{
    [RequireSscApiKey]
    [ImpersonateApiKeyUser]
    [EnableApiKeyCors]
    [SuppressFormsAuthenticationRedirect]
    public class HabitatFitnessEventFavoritesController : Controller
    {
        private IStringValueListFacetService facetService;

        public HabitatFitnessEventFavoritesController([NotNull]IStringValueListFacetService facetService)
        {
            this.facetService = facetService;
        }

        [ActionName("add")]
        [HttpPost]
        [CancelCurrentPage]
        public ActionResult Add([System.Web.Http.FromBody]EventPayload data)
        {
            // TODO: move data validation
            if (!data.IsValid())
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest, "invalid data");
            }
            try
            {
                facetService.Add(data.EventIdFormatted, FacetIDs.FavoriteEvents);
            }
            catch (Exception ex)
            {
                Log.Error($"Unable to add value '{data.EventId}' to contact's '${FacetIDs.FavoriteEvents}' facet ", ex, this);
                return new HttpStatusCodeResult(HttpStatusCode.InternalServerError, ex.Message);
            }

            return new HttpStatusCodeResult(HttpStatusCode.OK);
        }

        [ActionName("remove")]
        [HttpPost]
        [CancelCurrentPage]
        public ActionResult Remove([System.Web.Http.FromBody]EventPayload data)
        {
            // TODO: move data validation
            if (!data.IsValid())
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest, "invalid data");
            }
            try
            {
                facetService.Remove(data.EventIdFormatted, FacetIDs.FavoriteEvents);
            }
            catch (Exception ex)
            {
                Log.Error($"Unable to remove value '{data.EventId}' to contact's '${FacetIDs.FavoriteEvents}' facet ", ex, this);
                return new HttpStatusCodeResult(HttpStatusCode.InternalServerError, ex.Message);
            }

            return new HttpStatusCodeResult(HttpStatusCode.OK);
        }
    }
}