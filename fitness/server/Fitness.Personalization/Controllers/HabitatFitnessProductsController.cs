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
    public class HabitatFitnessProductsController : Controller
    {
        private IProductDataService dataService;
        private IItemSerializer itemSerializer;
        private IItemScoringService itemScoringService;

        public HabitatFitnessProductsController([NotNull]IProductDataService dataService, IItemScoringService itemScoringService, IItemSerializer itemSerializer)
        {
            this.dataService = dataService;
            this.itemSerializer = itemSerializer;
            this.itemScoringService = itemScoringService;
        }

        [HttpGet]
        [ActionName("Index")]
        [CancelCurrentPage]
        public ActionResult Get(int take = 4)
        {
            try
            {
                var allItems = dataService.GetAll(Context.Database);
                var scroredItems = itemScoringService.ScoreItems(allItems, Context.Database);
                var items = new JArray(scroredItems.Take(take).Select(i => JObject.Parse(itemSerializer.Serialize(i))));
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