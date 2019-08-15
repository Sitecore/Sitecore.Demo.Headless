using System;
using System.Net;
using System.Web.Mvc;
using Sitecore.Diagnostics;
using Sitecore.HabitatHome.Fitness.Feature.Collection.Model;
using Sitecore.HabitatHome.Fitness.Feature.Collection.Services;
using Sitecore.HabitatHome.Fitness.Foundation.Collection.Model.Filters;
using Sitecore.HabitatHome.Fitness.Foundation.Collection.Model.Services;
using Sitecore.LayoutService.Mvc.Security;

namespace Sitecore.HabitatHome.Fitness.Feature.Collection.Controllers
{
    [RequireSscApiKey]
    [ImpersonateApiKeyUser]
    [EnableApiKeyCors]
    [SuppressFormsAuthenticationRedirect]
    public class HabitatFitnessDemographicsController : Controller
    {
        private IDemographicsService service;

        public HabitatFitnessDemographicsController([NotNull]IDemographicsService service)
        {
            this.service = service;
        }

        [ActionName("facet")]
        [HttpPost]
        [CancelCurrentPage]
        public ActionResult UpdateFacet([System.Web.Http.FromBody]DemographicsPayload data)
        {
            try
            {
                service.UpdateFacet(data);
            }
            catch (Exception ex)
            {
                Log.Error($"Error while running UpdateFacet API", ex, this);
                return new HttpStatusCodeResult(HttpStatusCode.InternalServerError, ex.Message);
            }

            return new HttpStatusCodeResult(HttpStatusCode.OK);
        }

        [ActionName("profile")]
        [HttpPost]
        [CancelCurrentPage]
        public ActionResult UpdateProfile([System.Web.Http.FromBody]DemographicsPayload data)
        {
            try
            {
                service.UpdateProfile(data);
            }
            catch (Exception ex)
            {
                Log.Error($"Error while running UpdateProfile API", ex, this);
                return new HttpStatusCodeResult(HttpStatusCode.InternalServerError, ex.Message);
            }

            return new HttpStatusCodeResult(HttpStatusCode.OK);
        }
    }
}