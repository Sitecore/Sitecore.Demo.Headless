using System;
using System.Linq;
using System.Net;
using System.Web.Mvc;
using Newtonsoft.Json.Linq;
using Sitecore.Analytics;
using Sitecore.Annotations;
using Sitecore.Diagnostics;
using Sitecore.Demo.Fitness.Feature.Personalization.Services;
using Sitecore.Demo.Fitness.Feature.Personalization.Utils;
using Sitecore.Demo.Fitness.Foundation.Analytics;
using Sitecore.Demo.Fitness.Foundation.Analytics.Filters;
using Sitecore.Demo.Fitness.Foundation.Analytics.Services;
using Sitecore.LayoutService.Mvc.Security;
using Sitecore.LayoutService.Serialization.ItemSerializers;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.IO;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System.Dynamic;

namespace Sitecore.Demo.Fitness.Feature.Personalization.Controllers
{
    [RequireSscApiKey]
    [ImpersonateApiKeyUser]
    [EnableApiKeyCors]
    [SuppressFormsAuthenticationRedirect]
    public class LighthouseFitnessBoxeverController : Controller
    {
        private string url = @"https://api-eu-west-1-production.boxever.com";
        private string userName = @"fouatnr2j122o9z5u403ur7g24mxcros";
        private string password = @"z0a7iqgifq70d9kcs8wbs0jf80fthftg";
        private HttpClient httpClient = new HttpClient();

        public LighthouseFitnessBoxeverController()
        {
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(
                AuthenticationSchemes.Basic.ToString(),
                System.Convert.ToBase64String(Encoding.ASCII.GetBytes($"{userName}:{password}"))
                );
        }

        public string GetRequest(string apiUrlSegments)
        {
            HttpResponseMessage response = httpClient.GetAsync($"{url}{apiUrlSegments}").Result;
            string result = string.Empty;
            using (StreamReader stream = new StreamReader(response.Content.ReadAsStreamAsync().Result))
            {
                result = stream.ReadToEnd();
            }
            return result;
        }

        public string PostRequest(string apiUrlSegments)
        {
            Stream req = Request.InputStream;
            req.Seek(0, SeekOrigin.Begin);
            string json = new StreamReader(req).ReadToEnd();
            var stringContent = new StringContent(json, Encoding.UTF8, "application/json");
            var response = httpClient.PostAsync($"{url}{apiUrlSegments}", stringContent).Result;
            return response.Content.ReadAsStringAsync().Result;
        }

        public string DeleteRequest(string apiUrlSegments)
        {
            HttpResponseMessage response = httpClient.DeleteAsync($"{url}{apiUrlSegments}").Result;
            string result = string.Empty;
            using (StreamReader stream = new StreamReader(response.Content.ReadAsStreamAsync().Result))
            {
                result = stream.ReadToEnd();
            }
            return result;
        }

        [HttpGet]
        [ActionName("Index")]
        [CancelCurrentPage]
        public ActionResult Get([NotNull]string guestRef)
        {
            try
            {
                return Content(
                    GetRequest($"/v2/guests/{guestRef}"), 
                    "application/json"
                    );
            }
            catch (Exception ex)
            {
                Log.Error("Unable to retrieve guest", ex, this);
                return new HttpStatusCodeResult(HttpStatusCode.InternalServerError, ex.Message);
            }
        }

        [HttpGet]
        [ActionName("getguestdataextensionexpanded")]
        [CancelCurrentPage]
        public ActionResult GetGuestDataExtensionExpanded([NotNull] string guestRef, [NotNull] string dataExtensionName)
        {
            try
            {
                return Content(
                    GetRequest($"/v2/guests/{guestRef}?expand=ext{dataExtensionName}"), 
                    "application/json"
                    );
            }
            catch (Exception ex)
            {
                Log.Error("Unable to retrieve guest data extension expanded", ex, this);
                return new HttpStatusCodeResult(HttpStatusCode.InternalServerError, ex.Message);
            }
        }

        [HttpGet]
        [ActionName("getguests")]
        [CancelCurrentPage]
        public ActionResult GetGuests()
        {
            try
            {
                return Content(
                    GetRequest("/v2/guests"), 
                    "application/json"
                    );
            }
            catch (Exception ex)
            {
                Log.Error("Unable to retrieve guests", ex, this);
                return new HttpStatusCodeResult(HttpStatusCode.InternalServerError, ex.Message);
            }
        }

        [HttpGet]
        [ActionName("getlocateguestdataextensions")]
        [CancelCurrentPage]
        public ActionResult GetLocateGuestDataExtensions([NotNull] string guestRef, [NotNull] string dataExtensionName)
        {
            try
            {
                return Content(
                    GetRequest($"/v2/guests/{guestRef}/ext{dataExtensionName}"),
                    "application/json"
                    );
            }
            catch (Exception ex)
            {
                Log.Error("Unable to retrieve guests", ex, this);
                return new HttpStatusCodeResult(HttpStatusCode.InternalServerError, ex.Message);
            }
        }

        [HttpGet]
        [ActionName("getretrieveguestdataextension")]
        [CancelCurrentPage]
        public ActionResult GetRetrieveGuestDataExtension([NotNull] string guestRef, [NotNull] string dataExtensionName, [NotNull] string dataExtensionRef)
        {
            try
            {
                return Content(
                    GetRequest($"/v2/guests/{guestRef}/ext{dataExtensionName}/{dataExtensionRef}"),
                    "application/json"
                    );
            }
            catch (Exception ex)
            {
                Log.Error("Unable to retrieve guests", ex, this);
                return new HttpStatusCodeResult(HttpStatusCode.InternalServerError, ex.Message);
            }
        }

        [HttpPost]
        [ActionName("createguestdataextension")]
        [CancelCurrentPage]
        public ActionResult CreateGuestDataExtension([NotNull] string guestRef, [NotNull] string dataExtensionName)
        {
            try
            {
                return Content(
                    PostRequest($"/v2/guests/{guestRef}/ext{dataExtensionName}"),
                    "application/json"
                    );
            }
            catch (Exception ex)
            {
                Log.Error("Unable to create guest data extension", ex, this);
                return new HttpStatusCodeResult(HttpStatusCode.InternalServerError, ex.Message);
            }
        }

        [HttpDelete]
        [ActionName("deleteguestdataextension")]
        [CancelCurrentPage]
        public ActionResult DeleteGuestDataExtension([NotNull] string guestRef, [NotNull] string dataExtensionName, [NotNull] string dataExtensionRef)
        {
            try
            {
                return Content(
                    DeleteRequest($"/v2/guests/{guestRef}/ext{dataExtensionName}/{dataExtensionRef}"),
                    "application/json"
                    );
            }
            catch (Exception ex)
            {
                Log.Error("Unable to delete guest data extension", ex, this);
                return new HttpStatusCodeResult(HttpStatusCode.InternalServerError, ex.Message);
            }
        }
    }
}