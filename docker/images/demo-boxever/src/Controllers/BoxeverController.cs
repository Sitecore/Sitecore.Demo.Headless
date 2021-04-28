using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Server.HttpSys;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.IO;
using System.Diagnostics.CodeAnalysis;

namespace Sitecore.Integrations.Boxever.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class BoxeverController : Controller
    {
        private readonly string apiUrl = "";
        private readonly string clientKey = "";
        private readonly string apiToken = "";
        private readonly string apiVersion = "/v2";
        private HttpClient httpClient = new HttpClient();

        public BoxeverController()
        {
            apiUrl = Environment.GetEnvironmentVariable("BOXEVER_APIURL");
            clientKey = Environment.GetEnvironmentVariable("BOXEVER_CLIENTKEY");
            apiToken = Environment.GetEnvironmentVariable("BOXEVER_APITOKEN");
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(
                AuthenticationSchemes.Basic.ToString(),
                System.Convert.ToBase64String(Encoding.ASCII.GetBytes($"{clientKey}:{apiToken}"))
                    );
        }

        private string GetRequest(string apiUrlSegments)
        {
            HttpResponseMessage response = httpClient.GetAsync($"{apiUrl}{apiVersion}{apiUrlSegments}").Result;
            string result = string.Empty;
            using (StreamReader stream = new StreamReader(response.Content.ReadAsStreamAsync().Result))
            {
                result = stream.ReadToEnd();
            }
            return result;
        }

        private string PostRequest(string apiUrlSegments, string json)
        {
            var stringContent = new StringContent(json, Encoding.UTF8, "application/json");
            var response = httpClient.PostAsync($"{apiUrl}{apiVersion}{apiUrlSegments}", stringContent).Result;
            return response.Content.ReadAsStringAsync().Result;
        }

        private string DeleteRequest(string apiUrlSegments)
        {
            HttpResponseMessage response = httpClient.DeleteAsync($"{apiUrl}{apiVersion}{apiUrlSegments}").Result;
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

        [HttpGet("getguestByRef")]
        public ActionResult GetGuestByRef([NotNull] string guestRef)
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
        [Consumes("application/json")]
        public ActionResult CreateGuestDataExtension([NotNull] string guestRef, [NotNull] string dataExtensionName, [FromBody] string body)
        {
            try
            {
                return Content(
                    PostRequest($"/guests/{guestRef}/ext{dataExtensionName}", body),
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
                    return StatusCode(StatusCodes.Status204NoContent);

                var keyList = dataExtensionJson.Value["items"]?.Children();

                if (keyList == null)
                    return StatusCode(StatusCodes.Status204NoContent);

                var keyRefList = new List<string>();
                foreach (var key in keyList)
                {
                    var keyRef = key.Value<string>("ref");
                    keyRefList.Add(keyRef);
                }

                if (keyRefList == null || keyRefList.Count < 1)
                    return StatusCode(StatusCodes.Status204NoContent);

                foreach (var keyRef in keyRefList)
                {
                    DeleteGuestDataExtension(guestRef, dataExtensionName, keyRef);
                }

                return StatusCode(StatusCodes.Status200OK);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
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
                    return StatusCode(StatusCodes.Status404NotFound);

                var keyList = dataExtensionJson.Value["items"]?.Children();

                if (keyList == null)
                    return StatusCode(StatusCodes.Status404NotFound);

                var key = keyList.Value.FirstOrDefault(i => i.Value<string>("key").ToLower() == keyName.ToLower());

                if (key == null)
                    return StatusCode(StatusCodes.Status404NotFound);

                var keyRef = key.Value<string>("ref");

                if (String.IsNullOrWhiteSpace(keyRef))
                    return StatusCode(StatusCodes.Status404NotFound);

                return DeleteGuestDataExtension(guestRef, dataExtensionName, keyRef);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }
    }
}
