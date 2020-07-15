using System;
using System.Net;
using System.Web.Mvc;
using Sitecore.Diagnostics;
using Sitecore.Demo.Fitness.Feature.Collection.Model;
using Sitecore.Demo.Fitness.Feature.Collection.Services;
using Sitecore.Demo.Fitness.Foundation.Analytics.Filters;
using Sitecore.Demo.Fitness.Foundation.Analytics.Services;
using Sitecore.LayoutService.Mvc.Security;

namespace Sitecore.Demo.Fitness.Feature.Collection.Controllers
{
    [RequireSscApiKey]
    [ImpersonateApiKeyUser]
    [EnableApiKeyCors]
    [SuppressFormsAuthenticationRedirect]
    public class LighthouseFitnessIdentificationController : Controller
    {
        private IIdentificationService service;

        public LighthouseFitnessIdentificationController([NotNull]IIdentificationService service)
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