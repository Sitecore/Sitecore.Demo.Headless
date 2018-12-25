using System.Net;
using Sitecore.LayoutService.Mvc.Security;
using System.Web.Mvc;
using System;
using Sitecore.HabitatHome.Fitness.Collection.Filters;
using Sitecore.Diagnostics;
using Sitecore.HabitatHome.Fitness.Personalization.Services;
using System.Linq;
using Newtonsoft.Json.Linq;
using Sitecore.LayoutService.Serialization.ItemSerializers;

namespace Sitecore.HabitatHome.Fitness.Personalization.Controllers
{
    [RequireSscApiKey]
    [ImpersonateApiKeyUser]
    [EnableApiKeyCors]
    [SuppressFormsAuthenticationRedirect]
    public class HabitatFitnessEventsController : Controller
    {
        private IEventDataService dataService;
        private IItemSerializer itemSerializer;
        private IItemScoringService itemScoringService;

        public HabitatFitnessEventsController([NotNull]IEventDataService dataService, IItemScoringService itemScoringService, IItemSerializer itemSerializer)
        {
            this.dataService = dataService;
            this.itemSerializer = itemSerializer;
            this.itemScoringService = itemScoringService;
        }

        [HttpGet]
        [ActionName("Index")]
        [CancelCurrentPage]
        public ActionResult Get(int take, int skip, float lat, float lng, string profiles)
        {
            try
            {
                var profileNames = string.IsNullOrWhiteSpace(profiles) ? new string[0] : profiles.Split('|');
                var allItems = dataService.GetAll(Context.Database, profileNames, take, skip, lat, lng, out int totalSearchResults);
                var scoredItems = itemScoringService.ScoreItems(allItems, Context.Database);

                // if no items were scrored - return the original item list
                if (!scoredItems.Any())
                {
                    scoredItems = allItems;
                }

                var events = new JArray(scoredItems.Take(take).Select(i => JObject.Parse(itemSerializer.Serialize(i))));
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
    }
}