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
                Stream req = Request.InputStream;
                req.Seek(0, System.IO.SeekOrigin.Begin);
                string json = new StreamReader(req).ReadToEnd();

			 //var input = JsonConvert.DeserializeObject<dynamic>(json);

			 //var jsonStream = new StreamReader(HttpContext.Request.InputStream).ReadToEnd();
			 //var jsonString = JsonConvert.ToString(jsonStream);

			 //var json = HttpContext.Request.InputStream.ToString();
			 //var json = JsonConvert.ToString(HttpContext.Request.InputStream.ToString());
			 //json = json.Replace("\"", "\\\"");
			 //json = "{\"key\": \"email\",\"format\": \"HTML\",\"acceptedTermsAndConditions\": true,\"shortDescription\": \"The email preferences for this guest\",\"longDescription\": \"The email preferences for this guest\"}";
			 var stringContent = new StringContent(json, Encoding.UTF8, "application/json");
			 var response = httpClient.PostAsync($"{url}/v2/guests/{guestRef}/ext{dataExtensionName}", stringContent).Result;
			 var content = response.Content.ReadAsStringAsync().Result;

			 //var converter = new ExpandoObjectConverter();
			 //var exObj = JsonConvert.DeserializeObject<ExpandoObject>(jsonBody.ToString(), converter);


			 return Content(
                    content,
                    "application/json"
                    );


                //var stringContent = new StringContent(json, Encoding.UTF8, "application/json");
                //httpClient.DefaultRequestHeaders.ExpectContinue = false;
                //HttpResponseMessage response = httpClient.PostAsync($"{url}/{guestRef}/ext{dataExtensionName}", stringContent).Result;
                //string result = string.Empty;
                //using (StreamReader stream = new StreamReader(response.Content.ReadAsStreamAsync().Result))
                //{
                //    result = stream.ReadToEnd();
                //}

                //return Content(
                //    result,
                //    "application/json"
                //    );
            }
            catch (Exception ex)
            {
                Log.Error("Unable to create guest data extension", ex, this);
                return new HttpStatusCodeResult(HttpStatusCode.InternalServerError, ex.Message);
            }
        }
    }
}