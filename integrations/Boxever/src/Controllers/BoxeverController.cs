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

namespace Boxever.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class BoxeverController : Controller
    {
        private string apiUrl = "";
        private string clientKey = "";
        private string apiToken = "";
        private HttpClient httpClient = new HttpClient();
        private readonly IConfiguration config;


        public BoxeverController(IConfiguration configuration)
        {
            config = configuration;
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
            var response = httpClient.PostAsync($"{apiUrl}{apiUrlSegments}", stringContent).Result;
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
                    GetRequest($"/v2/guests/{guestRef}"),
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
                    GetRequest($"/v2/guests/{guestRef}?expand=ext{dataExtensionName}"),
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
                    GetRequest("/v2/guests"),
                    "application/json"
                    );
            }
            catch (Exception ex)
            {
                return  StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpGet("getlocateguestdataextensions")]
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
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpGet("getretrieveguestdataextension")]
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
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpPost("createguestdataextension")]
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
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpDelete("deleteguestdataextension")]
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
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }
    }
}
