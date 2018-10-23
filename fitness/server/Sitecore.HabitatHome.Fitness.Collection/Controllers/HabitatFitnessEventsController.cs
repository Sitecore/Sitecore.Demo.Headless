using System.Net;
using System.Net.Http;
using Sitecore.LayoutService.Mvc.Security;
using System.Web.Mvc;
using System;
using Sitecore.HabitatHome.Fitness.Collection.Model;
using Sitecore.HabitatHome.Fitness.Collection.Services;
using Sitecore.HabitatHome.Fitness.Collection.Filters;

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
        public HttpResponseMessage UpdateDemographics([System.Web.Http.FromBody]DemographicsPayload data)
        {
            try
            {
                facetUpdateService.UpdateDemographicsFacet(data);
                profileUpdateService.UpdateDemographicsProfile(data);
            }
            catch (Exception ex)
            {
                return new HttpResponseMessage(HttpStatusCode.InternalServerError)
                {
                    Content = new StringContent(ex.Message)
                };
            }

            return new HttpResponseMessage(HttpStatusCode.OK);
        }

        [ActionName("identifiers")]
        [HttpPost]
        [CancelCurrentPage]
        public HttpResponseMessage UpdateIdentifiers([System.Web.Http.FromBody]IdentificationPayload data)
        {
            try
            {
                this.facetUpdateService.UpdateIdentificationFacet(data);
            }
            catch (Exception ex)
            {
                return new HttpResponseMessage(HttpStatusCode.InternalServerError)
                {
                    Content = new StringContent(ex.Message)
                };
            }

            return new HttpResponseMessage(HttpStatusCode.OK);
        }

        [HttpPost]
        [ActionName("sportratings")]
        [CancelCurrentPage]
        public HttpResponseMessage UpdateSportRatings([System.Web.Http.FromBody]SportPreferencesPayload data)
        {
            try
            {
                this.facetUpdateService.UpdateSportsFacet(data);
                this.profileUpdateService.UpdateSportsProfile(data);
            }
            catch (Exception ex)
            {
                return new HttpResponseMessage(HttpStatusCode.InternalServerError)
                {
                    Content = new StringContent(ex.Message)
                };
            }

            return new HttpResponseMessage(HttpStatusCode.OK);
        }

        [ActionName("flush")]
        [HttpPost]
        [CancelCurrentPage]
        public HttpResponseMessage Flush()
        {
            Session.Abandon();
            return new HttpResponseMessage(HttpStatusCode.OK);
        }
    }
}