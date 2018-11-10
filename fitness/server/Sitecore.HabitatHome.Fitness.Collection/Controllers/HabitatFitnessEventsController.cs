using System.Net;
using System.Net.Http;
using Sitecore.LayoutService.Mvc.Security;
using System.Web.Mvc;
using System;
using Sitecore.HabitatHome.Fitness.Collection.Model;
using Sitecore.HabitatHome.Fitness.Collection.Services;
using Sitecore.HabitatHome.Fitness.Collection.Filters;
using Sitecore.Diagnostics;

namespace Sitecore.HabitatHome.Fitness.Collection.Controllers
{
    [RequireSscApiKey]
    [ImpersonateApiKeyUser]
    [EnableApiKeyCors]
    [SuppressFormsAuthenticationRedirect]
    public class HabitatFitnessEventsController : Controller
    {
        private IFacetUpdateService facetUpdateService;
        private IProfileUpdateService profileUpdateService;

        public HabitatFitnessEventsController([NotNull]IFacetUpdateService facetUpdateService, [NotNull]IProfileUpdateService profileUpdateService)
        {
            this.facetUpdateService = facetUpdateService;
            this.profileUpdateService = profileUpdateService;
        }

        [ActionName("demographics")]
        [HttpPost]
        [CancelCurrentPage]
        public ActionResult UpdateDemographics([System.Web.Http.FromBody]DemographicsPayload data)
        {
            try
            {
                facetUpdateService.UpdateDemographicsFacet(data);
                profileUpdateService.UpdateDemographicsProfile(data);
            }
            catch (Exception ex)
            {
                Log.Error($"Error while running UpdateDemographics API", ex, this);
                return new HttpStatusCodeResult(HttpStatusCode.InternalServerError, ex.Message);
            }

            return new HttpStatusCodeResult(HttpStatusCode.OK);
        }

        [ActionName("identifiers")]
        [HttpPost]
        [CancelCurrentPage]
        public ActionResult UpdateIdentifiers([System.Web.Http.FromBody]IdentificationPayload data)
        {
            try
            {
                this.facetUpdateService.UpdateIdentificationFacet(data);
            }
            catch (Exception ex)
            {
                Log.Error($"Error while running UpdateIdentifiers API", ex, this);
                return new HttpStatusCodeResult(HttpStatusCode.InternalServerError, ex.Message);
            }

            return new HttpStatusCodeResult(HttpStatusCode.OK);
        }

        // TODO: split
        [HttpPost]
        [ActionName("sportratings")]
        [CancelCurrentPage]
        public ActionResult UpdateSportRatings([System.Web.Http.FromBody]SportPreferencesPayload data)
        {
            try
            {
                this.facetUpdateService.UpdateSportsFacet(data);
              
            }
            catch (Exception ex)
            {
                Log.Error($"Error while running UpdateSportRatings.UpdateSportsFacet API", ex, this);
                return new HttpStatusCodeResult(HttpStatusCode.InternalServerError, ex.Message);
            }

            try
            {
                this.profileUpdateService.UpdateSportsProfile(data);
            }
            catch (Exception ex)
            {
                Log.Error($"Error while running UpdateSportRatings.UpdateSportsProfile API", ex, this);
                return new HttpStatusCodeResult(HttpStatusCode.InternalServerError, ex.Message);
            }

            return new HttpStatusCodeResult(HttpStatusCode.OK);
        }

        [ActionName("flush")]
        [HttpPost]
        [CancelCurrentPage]
        public ActionResult Flush()
        {
            try
            {
                Session.Abandon();
                return new HttpStatusCodeResult(HttpStatusCode.OK, "session flushed successfully");
            }
            catch (Exception ex)
            {
                Log.Error($"Error while running Flush API", ex, this);
                return new HttpStatusCodeResult(HttpStatusCode.InternalServerError, ex.Message);
            }
        }
    }
}