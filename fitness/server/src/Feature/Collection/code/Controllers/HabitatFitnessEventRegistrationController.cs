using System;
using System.Net;
using System.Web.Mvc;
using Sitecore.Diagnostics;
using Sitecore.HabitatHome.Fitness.Feature.Collection.Model;
using Sitecore.HabitatHome.Fitness.Foundation.Collection.Model;
using Sitecore.HabitatHome.Fitness.Foundation.Collection.Model.Filters;
using Sitecore.HabitatHome.Fitness.Foundation.Collection.Model.Services;
using Sitecore.LayoutService.Mvc.Security;

namespace Sitecore.HabitatHome.Fitness.Feature.Collection.Controllers
{
    [RequireSscApiKey]
    [ImpersonateApiKeyUser]
    [EnableApiKeyCors]
    [SuppressFormsAuthenticationRedirect]
    public class HabitatFitnessEventRegistrationController : Controller
    {
        private IStringValueListFacetService facetService;

        public HabitatFitnessEventRegistrationController([NotNull]IStringValueListFacetService facetService)
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
                facetService.Add(data.EventIdFormatted, FacetIDs.RegisteredEvents);
            }
            catch (Exception ex)
            {
                Log.Error($"Unable to add value '{data.EventId}' to contact's '${FacetIDs.RegisteredEvents}' facet ", ex, this);
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
                facetService.Add(data.EventIdFormatted, FacetIDs.RegisteredEvents);
            }
            catch (Exception ex)
            {
                Log.Error($"Unable to remove value '{data.EventId}' to contact's '${FacetIDs.RegisteredEvents}' facet ", ex, this);
                return new HttpStatusCodeResult(HttpStatusCode.InternalServerError, ex.Message);
            }

            return new HttpStatusCodeResult(HttpStatusCode.OK);
        }
    }
}