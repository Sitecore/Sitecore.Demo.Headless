using System;
using System.Linq;
using System.Net;
using System.Web.Mvc;
using Newtonsoft.Json.Linq;
using Sitecore.Annotations;
using Sitecore.Diagnostics;
using Sitecore.Demo.Fitness.Feature.Personalization.Services;
using Sitecore.Demo.Fitness.Foundation.Analytics.Filters;
using Sitecore.LayoutService.Mvc.Security;
using Sitecore.LayoutService.Serialization.ItemSerializers;

namespace Sitecore.Demo.Fitness.Feature.Personalization.Controllers
{
    [RequireSscApiKey]
    [ImpersonateApiKeyUser]
    [EnableApiKeyCors]
    [SuppressFormsAuthenticationRedirect]
    public class LighthouseFitnessProductsController : Controller
    {
        private IProductDataService dataService;
        private IItemSerializer itemSerializer;
        private IItemScoringService itemScoringService;

        public LighthouseFitnessProductsController([NotNull]IProductDataService dataService, IItemScoringService itemScoringService, IItemSerializer itemSerializer)
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
                var scoredItems = itemScoringService.ScoreItems(allItems, Context.Database);
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