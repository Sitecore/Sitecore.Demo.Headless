using Newtonsoft.Json.Linq;
using Sitecore.Analytics;
using Sitecore.Annotations;
using Sitecore.Demo.Fitness.Feature.Personalization.Services;
using Sitecore.Demo.Fitness.Feature.Personalization.Utils;
using Sitecore.Demo.Fitness.Foundation.Analytics.Filters;
using Sitecore.Demo.Fitness.Foundation.Analytics.Services;
using Sitecore.Diagnostics;
using Sitecore.LayoutService.Mvc.Security;
using Sitecore.LayoutService.Serialization.ItemSerializers;
using System;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web.Mvc;

namespace Sitecore.Demo.Fitness.Feature.Personalization.Controllers
{
    [RequireSscApiKey]
    [ImpersonateApiKeyUser]
    [EnableApiKeyCors]
    [SuppressFormsAuthenticationRedirect]
    public class LighthouseFitnessEventsController : Controller
    {
        private IEventDataService dataService;
        private IItemSerializer itemSerializer;
        private IItemScoringService itemScoringService;
        private IStringValueListFacetService facetService;

        public LighthouseFitnessEventsController([NotNull]IEventDataService dataService, [NotNull]IItemScoringService itemScoringService, [NotNull]IItemSerializer itemSerializer, [NotNull]IStringValueListFacetService facetService)
        {
            this.dataService = dataService;
            this.itemSerializer = itemSerializer;
            this.itemScoringService = itemScoringService;
            this.facetService = facetService;
        }

        [HttpGet]
        [ActionName("Index")]
        [CancelCurrentPage]
        public ActionResult Get(int take = -1, int skip = -1, float lat = 0, float lng = 0, string profiles = "", bool personalize = true)
        {
            try
            {
                // fetching profile names from the action parameter
                var profileNames = string.IsNullOrWhiteSpace(profiles) ? new string[0] : profiles.Split('|');
                // or loading from the tracker if not specified
                if (personalize && !profileNames.Any())
                {
                    profileNames = Tracker.Current.GetPopulatedProfilesFromTracker();
                }

                var allItems = dataService.GetAll(Context.Database, profileNames, take, skip, lat, lng, out int totalSearchResults);

                if (personalize)
                {
                    var scoredItems = itemScoringService.ScoreItems(allItems, Context.Database);
                    // return scored items only if anything was returned
                    if (scoredItems.Any())
                    {
                        allItems = scoredItems;
                    }
                }

                var events = new JArray(allItems.Select(i => JObject.Parse(itemSerializer.Serialize(i))));
                var results = new JObject
                {
                    { "events", events },
                    { "total", totalSearchResults }
                };

                return Content(results.ToString(), "application/json");
            }
            catch (Exception ex)
            {
                Log.Error("Unable to retrieve events", ex, this);
                return new HttpStatusCodeResult(HttpStatusCode.InternalServerError, ex.Message);
            }
        }

        [HttpGet]
        [ActionName("getregistrations")]
        [CancelCurrentPage]
        public ActionResult GetRegistrations()
        {
            try
            {
                var client = new HttpClient { BaseAddress = new Uri("https://localhost:44375") };

                client.BaseAddress = new Uri("https://localhost:44375/Boxever/getguestdataextensionexpanded");
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

                using (HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Get, $"/Boxever/getguestdataextensionexpanded?guestRef=89fd8576-ecfa-44c0-94e1-b58c4026babd&dataExtensionName=RegisteredEvents"))
                {
                    using (var response = client.SendAsync(request))
                    {
                        var responseContent = response.Result.ToString();
                        return new HttpStatusCodeResult(HttpStatusCode.OK);

                    }
                }
            }
            catch (Exception ex)
            {
                Log.Error("Unable to retrieve events", ex, this);
                return new HttpStatusCodeResult(HttpStatusCode.InternalServerError, ex.Message);
            }
        }

        [HttpGet]
        [ActionName("getfavorites")]
        [CancelCurrentPage]
        public ActionResult GetFavorites()
        {
            try
            {
                var client = new HttpClient {BaseAddress = new Uri("https://localhost:44375")};

                client.BaseAddress = new Uri("https://localhost:44375/Boxever/getguestdataextensionexpanded");
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

                using (HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Get, $"/Boxever/getguestdataextensionexpanded?guestRef=89fd8576-ecfa-44c0-94e1-b58c4026babd&dataExtensionName=FavoritedEvents"))
                {
                    using (var response = client.SendAsync(request))
                    {
                        var responseContent = response.Result.ToString();
                        return new HttpStatusCodeResult(HttpStatusCode.OK);

                    }
                }
            }
            catch (Exception ex)
            {
                Log.Error("Unable to retrieve events", ex, this);
                return new HttpStatusCodeResult(HttpStatusCode.InternalServerError, ex.Message);
            }
        }
    }
}