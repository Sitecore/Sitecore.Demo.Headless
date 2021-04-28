using Newtonsoft.Json.Linq;
using Sitecore.Analytics;
using Sitecore.Annotations;
using Sitecore.Data.Items;
using Sitecore.Demo.Fitness.Feature.Personalization.Services;
using Sitecore.Demo.Fitness.Feature.Personalization.Utils;
using Sitecore.Demo.Fitness.Foundation.Analytics.Filters;
using Sitecore.Demo.Fitness.Foundation.Analytics.Services;
using Sitecore.Diagnostics;
using Sitecore.LayoutService.Mvc.Security;
using Sitecore.LayoutService.Serialization.ItemSerializers;
using System;
using System.Collections.Generic;
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
        [ActionName("geteventsbyid")]
        [CancelCurrentPage]
        public ActionResult GetEventsById([NotNull] string eventIds)
        {
            try
            {
                List<string> eventIdList = eventIds?.Split(',').Select(i => i?.Trim())?.ToList();

                if (eventIdList == null || !eventIdList.Any())
                    return new HttpStatusCodeResult(HttpStatusCode.NotFound, "Unable to retrieve events by ID - No event ID in request");

                var itemList = new List<Item>();
                foreach (var eventId in eventIdList)
                {
                    bool isValidGuid = Guid.TryParse(eventId, out Guid eventGuid);
                    if (isValidGuid)
                    {
                        var eventItem = dataService.GetById(Context.Database, eventGuid);
                        if (eventItem != null)
                            itemList.Add(eventItem);
                    }
                }
                
                if (!itemList.Any())
                    return new HttpStatusCodeResult(HttpStatusCode.NotFound, "Unable to retrieve events by ID");

                var events = new JArray(itemList.Select(i => JObject.Parse(itemSerializer.Serialize(i))));
                var results = new JObject
                {
                    { "events", events },
                    { "total", itemList.Count }
                };

                return Content(results.ToString(), "application/json");
            }
            catch (Exception ex)
            {
                Log.Error("Unable to retrieve events by ID", ex, this);
                return new HttpStatusCodeResult(HttpStatusCode.InternalServerError, ex.Message);
            }
        }
    }
}