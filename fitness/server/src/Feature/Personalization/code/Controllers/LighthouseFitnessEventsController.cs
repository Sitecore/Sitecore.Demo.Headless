using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web.Mvc;
using Newtonsoft.Json.Linq;
using Sitecore.Annotations;
using Sitecore.Data.Items;
using Sitecore.Demo.Fitness.Feature.Personalization.Services;
using Sitecore.Diagnostics;
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

        public LighthouseFitnessEventsController([NotNull]IEventDataService dataService, [NotNull]IItemSerializer itemSerializer)
        {
            this.dataService = dataService;
            this.itemSerializer = itemSerializer;
        }

        [HttpGet]
        [ActionName("Index")]
        // Before switching this demo from XP to Boxever, the sport type was set as a profile card on the event items.
        // This is why the parameter of this controller action is still named "profiles". It is used as is by other
        // code and should not be renamed unless renaming it where it is used as well.
        public ActionResult Get(int take = -1, int skip = -1, float lat = 0, float lng = 0, string profiles = "")
        {
            try
            {
                // fetching sport types from the action parameter.
                var sportTypes = string.IsNullOrWhiteSpace(profiles) ? new string[0] : profiles.Split('|');

                var allItems = dataService.GetAll(Context.Database, sportTypes, take, skip, lat, lng, out int totalSearchResults);
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
                    var guidId = "{"+eventId+"}";
                    bool isValidGuid = Guid.TryParse(guidId, out Guid eventGuid);
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
