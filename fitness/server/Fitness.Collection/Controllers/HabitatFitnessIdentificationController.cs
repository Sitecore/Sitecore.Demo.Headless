using System.Net;
using Sitecore.LayoutService.Mvc.Security;
using System.Web.Mvc;
using System;
using Sitecore.HabitatHome.Fitness.Collection.Model;
using Sitecore.HabitatHome.Fitness.Collection.Filters;
using Sitecore.Diagnostics;
using Sitecore.HabitatHome.Fitness.Collection.Services;

namespace Sitecore.HabitatHome.Fitness.Collection.Controllers
{
    [RequireSscApiKey]
    [ImpersonateApiKeyUser]
    [EnableApiKeyCors]
    [SuppressFormsAuthenticationRedirect]
    public class HabitatFitnessIdentificationController : Controller
    {
        private IIdentificationService service;

        public HabitatFitnessIdentificationController([NotNull]IIdentificationService service)
        {
            this.service = service;
        }

        [ActionName("facet")]
        [HttpPost]
        [CancelCurrentPage]
        public ActionResult UpdateFacet([System.Web.Http.FromBody]IdentificationPayload data)
        {
            try
            {
                service.UpdateFacet(data);
            }
            catch (Exception ex)
            {
                Log.Error($"Error while running IdentificationService API", ex, this);
                return new HttpStatusCodeResult(HttpStatusCode.InternalServerError, ex.Message);
            }

            return new HttpStatusCodeResult(HttpStatusCode.OK);
        }
    }
}