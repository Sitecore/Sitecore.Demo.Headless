using System.Net;
using Sitecore.LayoutService.Mvc.Security;
using System.Web.Mvc;
using System;
using Sitecore.Diagnostics;
using Sitecore.HabitatHome.Fitness.Foundation.Collection.Filters;

namespace Sitecore.HabitatHome.Fitness.Foundation.Collection.Controllers
{
    /// <summary>
    /// This controller is for development and testing purposes only
    /// </summary>
    [RequireSscApiKey]
    [ImpersonateApiKeyUser]
    [EnableApiKeyCors]
    [SuppressFormsAuthenticationRedirect]
    public class HabitatFitnessSessionController : Controller
    {
        /// <summary>
        /// Triggers session abandon (for development and testing purposes only)
        /// </summary>
        /// <returns></returns>
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