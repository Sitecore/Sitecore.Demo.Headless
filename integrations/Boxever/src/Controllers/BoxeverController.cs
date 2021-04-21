using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.IO;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Server.HttpSys;
using System.Diagnostics.CodeAnalysis;
using Microsoft.AspNetCore.Http;

namespace Sitecore.Integrations.Boxever.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class BoxeverController : Controller
    {
        private string apiUrl = "";
        private string clientKey = "";
        private string apiToken = "";
        private string apiVersion = "/v2";
        private HttpClient httpClient = new HttpClient();
        IConfiguration configuration;


        public BoxeverController(IConfiguration configuration)
        {
            this.configuration = configuration;

            apiUrl = "https://api-eu-west-1-production.boxever.com"; // config.GetValue<string>("BOXEVER_APIURL");
            clientKey = "fouatnr2j122o9z5u403ur7g24mxcros";// config.GetValue<string>("BOXEVER_CLIENTKEY");
            apiToken = "z0a7iqgifq70d9kcs8wbs0jf80fthftg";// config.GetValue<string>("BOXEVER_APITOKEN");
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(
                AuthenticationSchemes.Basic.ToString(),
                System.Convert.ToBase64String(Encoding.ASCII.GetBytes($"{clientKey}:{apiToken}"))
                    );
        }

        private string GetRequest(string apiUrlSegments)
        {
            HttpResponseMessage response = httpClient.GetAsync($"{apiUrl}{apiUrlSegments}").Result;
            string result = string.Empty;
            using (StreamReader stream = new StreamReader(response.Content.ReadAsStreamAsync().Result))
            {
                result = stream.ReadToEnd();
            }
            return result;
        }

        private string PostRequest(string apiUrlSegments)
        {
            Stream req = Request.Body;
            req.Seek(0, SeekOrigin.Begin);
            string json = new StreamReader(req).ReadToEnd();
            var stringContent = new StringContent(json, Encoding.UTF8, "application/json");
            var response = httpClient.PostAsync($"{apiUrl}{apiVersion}{apiUrlSegments}", stringContent).Result;
            return response.Content.ReadAsStringAsync().Result;
        }

        private string DeleteRequest(string apiUrlSegments)
        {
            HttpResponseMessage response = httpClient.DeleteAsync($"{apiUrl}{apiUrlSegments}").Result;
            string result = string.Empty;
            using (StreamReader stream = new StreamReader(response.Content.ReadAsStreamAsync().Result))
            {
                result = stream.ReadToEnd();
            }
            return result;
        }

        [HttpGet("Index")]
        public ActionResult Get([NotNull] string guestRef)
        {
            try
            {
                return Content(
                    GetRequest($"/guests/{guestRef}"),
                    "application/json"
                    );
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpGet("getguestdataextensionexpanded")]
        public ActionResult GetGuestDataExtensionExpanded([NotNull] string guestRef, [NotNull] string dataExtensionName)
        {
            try
            {
                return Content(
                    GetRequest($"/guests/{guestRef}?expand=ext{dataExtensionName}"),
                    "application/json"
                    );
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpGet("getguests")]
        public ActionResult GetGuests()
        {
            try
            {
                return Content(
                    GetRequest("/guests"),
                    "application/json"
                    );
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpGet("getlocateguestdataextensions")]
        public ActionResult GetLocateGuestDataExtensions([NotNull] string guestRef, [NotNull] string dataExtensionName)
        {
            try
            {
                return Content(
                    GetRequest($"/guests/{guestRef}/ext{dataExtensionName}"),
                    "application/json"
                    );
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpGet("getretrieveguestdataextension")]
        public ActionResult GetRetrieveGuestDataExtension([NotNull] string guestRef, [NotNull] string dataExtensionName, [NotNull] string dataExtensionRef)
        {
            try
            {
                return Content(
                    GetRequest($"/guests/{guestRef}/ext{dataExtensionName}/{dataExtensionRef}"),
                    "application/json"
                    );
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpPost("createguestdataextension")]
        public ActionResult CreateGuestDataExtension([NotNull] string guestRef, [NotNull] string dataExtensionName)
        {
            try
            {
                return Content(
                    PostRequest($"/guests/{guestRef}/ext{dataExtensionName}"),
                    "application/json"
                    );
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpDelete("deleteguestdataextension")]
        public ActionResult DeleteGuestDataExtension([NotNull] string guestRef, [NotNull] string dataExtensionName, [NotNull] string dataExtensionRef)
        {
            try
            {
                return Content(
                    DeleteRequest($"/guests/{guestRef}/ext{dataExtensionName}/{dataExtensionRef}"),
                    "application/json"
                    );
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpDelete("deleteallkeysforguestdataextension")]
        public ActionResult DeleteAllKeysForGuestDataExtension([NotNull] string guestRef, [NotNull] string dataExtensionName)
        {
            try
            {
                var requestResult = GetGuestDataExtensionExpanded(guestRef, dataExtensionName);
                var dynJson = JsonConvert.DeserializeObject<Dictionary<string, JToken>>(((ContentResult)requestResult).Content);
                var dataExtensionJson = dynJson.FirstOrDefault(i => i.Key == $"ext{dataExtensionName}");

                if (dataExtensionJson.Equals(new KeyValuePair<string, JToken>()))
                    return new HttpStatusCodeResult(HttpStatusCode.NotFound);

                var keyList = dataExtensionJson.Value["items"]?.Children();

                if (keyList == null)
                    return new HttpStatusCodeResult(HttpStatusCode.NotFound);

                var keyRefList = new List<string>();
                foreach (var key in keyList)
                {
                    var keyRef = key.Value<string>("ref");
                    keyRefList.Add(keyRef);
                }
                
                if (keyRefList == null || keyRefList.Count < 1)
                    return new HttpStatusCodeResult(HttpStatusCode.NotFound);

                foreach (var keyRef in keyRefList)
                {
                    DeleteGuestDataExtension(guestRef, dataExtensionName, keyRef);
                }

                return new HttpStatusCodeResult(HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                Log.Error("Unable to delete all keys for guest data extension", ex, this);
                return new HttpStatusCodeResult(HttpStatusCode.InternalServerError, ex.Message);
            }
        }

        [HttpDelete("deletekeyforguestdataextension")]
        public ActionResult DeleteKeyForGuestDataExtension([NotNull] string guestRef, [NotNull] string dataExtensionName, [NotNull] string keyName)
        {
            try
            {
                var requestResult = GetGuestDataExtensionExpanded(guestRef, dataExtensionName);
                var dynJson = JsonConvert.DeserializeObject<Dictionary<string, JToken>>(((ContentResult)requestResult).Content);
                var dataExtensionJson = dynJson.FirstOrDefault(i => i.Key == $"ext{dataExtensionName}");

                if (dataExtensionJson.Equals(new KeyValuePair<string, JToken>()))
                    return new HttpStatusCodeResult(HttpStatusCode.NotFound);

                var keyList = dataExtensionJson.Value["items"]?.Children();

                if (keyList == null)
                    return new HttpStatusCodeResult(HttpStatusCode.NotFound);

                var key = keyList.Value.FirstOrDefault(i => i.Value<string>("key").ToLower() == keyName.ToLower());

                if (key == null)
                    return new HttpStatusCodeResult(HttpStatusCode.NotFound);

                var keyRef = key.Value<string>("ref");

                if (String.IsNullOrWhiteSpace(keyRef))
                    return new HttpStatusCodeResult(HttpStatusCode.NotFound);

                return DeleteGuestDataExtension(guestRef, dataExtensionName, keyRef);
            }
            catch (Exception ex)
            {
                Log.Error("Unable to delete key for guest data extension", ex, this);
                return new HttpStatusCodeResult(HttpStatusCode.InternalServerError, ex.Message);
            }
        }
    }
}
