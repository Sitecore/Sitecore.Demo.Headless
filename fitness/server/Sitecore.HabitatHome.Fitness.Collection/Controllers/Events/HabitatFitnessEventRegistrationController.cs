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
    public class HabitatFitnessEventRegistrationController : Controller
    {
        private IFacetUpdateService facetUpdateService;

        public HabitatFitnessEventRegistrationController([NotNull]IFacetUpdateService facetUpdateService)
        {
            this.facetUpdateService = facetUpdateService;
        }

        [ActionName("add")]
        [HttpPost]
        [CancelCurrentPage]
        public HttpResponseMessage Add([System.Web.Http.FromBody]EventPayload data)
        {
            try
            {
                facetUpdateService.AddEventRegistrationFacet(data);
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

        [ActionName("remove")]
        [HttpPost]
        [CancelCurrentPage]
        public HttpResponseMessage Remove([System.Web.Http.FromBody]EventPayload data)
        {
            try
            {
                facetUpdateService.RemoveEventRegistrationFacet(data);
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
    }
}