using Newtonsoft.Json.Linq;
using Sitecore.Analytics;
using Sitecore.Analytics.Tracking;
using Sitecore.Data;
using Sitecore.Data.Items;
using Sitecore.Diagnostics;
using Sitecore.HabitatHome.Fitness.Collection.Model.Facets;
using Sitecore.HabitatHome.Fitness.Personalization.Services;
using Sitecore.LayoutService.Configuration;
using Sitecore.LayoutService.ItemRendering.ContentsResolvers;
using Sitecore.LayoutService.Serialization.Pipelines.GetFieldSerializer;
using Sitecore.Mvc.Presentation;
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;

namespace Sitecore.HabitatHome.Fitness.Personalization.RenderingContentsResolvers
{
    public class RecommendedItemResolver : IRenderingContentsResolver
    {
        private readonly IGetFieldSerializerPipeline getFieldSerializerPipeline;
        private readonly IDataService dataService;
        private const string SportsProfileItemId = "{8B3C8714-83CA-41F1-BBF6-FF260F732AAF}";

        public bool IncludeServerUrlInMediaUrls { get; set; }

        public bool UseContextItem { get; set; }

        public string ItemSelectorQuery { get; set; }

        public NameValueCollection Parameters { get; set; }

        public RecommendedItemResolver([NotNull]IGetFieldSerializerPipeline getFieldSerializerPipeline, [NotNull]IDataService dataService)
        {
            this.getFieldSerializerPipeline = getFieldSerializerPipeline;
            this.dataService = dataService;
        }

        public object ResolveContents(Rendering rendering, IRenderingConfiguration renderingConfig)
        {
            var datasource = !string.IsNullOrEmpty(rendering.DataSource)
                ? rendering.RenderingItem?.Database.GetItem(rendering.DataSource)
                : null;

            var serializer = new Serializers.ItemSerializer(getFieldSerializerPipeline);

            var items = GetItems(rendering) ?? Enumerable.Empty<Item>();

            return new
            {
                title = new { value = datasource["title"] },
                items = items.Select(c => JObject.Parse(serializer.Serialize(c)))
            };
        }

        private IEnumerable<Item> GetItems(Rendering rendering)
        {   
            Guid.TryParse(Parameters["templateid"], out Guid templateId);
            Guid.TryParse(Parameters["rootid"], out Guid rootId);
            bool.TryParse(Parameters["showAllIfNoProfile"], out bool showAllIfNoProfile);

            // no profiles are set and showAllIfNoProfile = false - returning null
            var sportsProfile = Tracker.Current?.Interaction?.Profiles[SportsFacet.DefaultKey];
            if ((sportsProfile == null || sportsProfile.Count <= 0) && !showAllIfNoProfile)
            {
                return null;
            }

            var allItems = dataService.GetAll(rendering.Item.Database, new ID(templateId), new ID(rootId)).ToList();

            if (sportsProfile == null || sportsProfile.Count <= 0 || !allItems.Any())
            {
                return allItems;
            }
             
            return GetRecommendedItems(allItems, rendering.Item.Database, sportsProfile);
        }

        private IEnumerable<Item> GetRecommendedItems(IEnumerable<Item> items, [NotNull]Database database, [NotNull]Profile sportsProfile)
        {
            var sportsProfileItem = database.GetItem(SportsProfileItemId);
            if (sportsProfileItem == null)
            {
                Log.Warn($"RecommendedEventListResolver: Sports Profile Item not found (id: {SportsProfileItemId}", this);
                return items;
            }

            var calculator = new DistanceCalculator();
            var collectedProfileItems = items.Select(i => new ProfiledItem(i)).ToList();

            calculator.Calculate(sportsProfile, collectedProfileItems, SportsFacet.DefaultKey, new Analytics.Data.Items.ProfileItem(sportsProfileItem));

            var sorted = collectedProfileItems.Where(i => i.ProfiledItemCalculation?.Distance <= 100).OrderBy(i => i.ProfiledItemCalculation?.Distance);

            return sorted.Select(i => i.Item);
        }
    }
}