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
                var eventIds = facetService.GetFacetValues(FacetIDs.RegisteredEvents);
                var subscriptions = facetService.GetFacetValues(FacetIDs.Subscriptions);
                var eventItems = eventIds.Select(id => dataService.GetById(Context.Database, Guid.Parse(id))).ToList();

                var events = new JArray();
                foreach (var eventItem in eventItems)
                {
                    var eventData = JObject.Parse(itemSerializer.Serialize(eventItem));
                    var eventId = eventItem.ID.Guid.ToString("D");
                    eventData.Add("active", subscriptions.Contains(eventId));
                    events.Add(eventData);
                }

                var results = new JObject
                {
                    { "events", events },
                    { "total", eventItems.Count }
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
        [ActionName("getfavorites")]
        [CancelCurrentPage]
        public ActionResult GetFavorites()
        {
            try
            {
                var eventIds = facetService.GetFacetValues(FacetIDs.FavoriteEvents);
                var eventItems = eventIds.Select(id => dataService.GetById(Context.Database, Guid.Parse(id))).ToList();
                var events = new JArray(eventItems.Select(i => JObject.Parse(itemSerializer.Serialize(i))));
                var results = new JObject
                {
                    { "events", events },
                    { "total", eventItems.Count }
                };

                return Content(results.ToString(), "application/json");
            }
            catch (Exception ex)
            {
                Log.Error("Unable to retrieve events", ex, this);
                return new HttpStatusCodeResult(HttpStatusCode.InternalServerError, ex.Message);
            }
        }
    }
}