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
using System.Web.Helpers;

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
        public ActionResult Get(int take = 5)
        {
            try
            {
                var allItems = dataService.GetAll(Context.Database);
                var scoredItems = itemScoringService.ScoreItems(allItems, Context.Database);

                // if no items were scrored - return the original item list
                if (!scoredItems.Any())
                {
                    scoredItems = allItems;
                }

                var items = new JArray(scoredItems.Take(take).Select(i => JObject.Parse(itemSerializer.Serialize(i))));
                return Content(items.ToString(), "application/json");
            }
            catch (Exception ex)
            {
                Log.Error("Unable to retrieve events", ex, this);
                return new HttpStatusCodeResult(HttpStatusCode.InternalServerError, ex.Message);
            }  
        }
    }
}