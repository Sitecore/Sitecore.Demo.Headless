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
            var profiles = Tracker.Current?.Interaction?.Profiles;
            if (profiles == null && !showAllIfNoProfile)
            {
                return null;
            }

            var allItems = dataService.GetAll(rendering.Item.Database, new ID(templateId), new ID(rootId)).ToList();

            if (!allItems.Any())
            {
                return allItems;
            }

            var recommendedItems = GetRecommendedItems(allItems, rendering.Item.Database);

            // if no recommended items returned, fallback to showing all items from the data service
            if (!recommendedItems.Any() && showAllIfNoProfile)
            {
                return allItems;
            }

            return recommendedItems;
        }

        private IEnumerable<Item> GetRecommendedItems(IEnumerable<Item> items, [NotNull]Database database)
        {
            var profiledBySports = GetProfiledItems(items, database, SportsFacet.DefaultKey, Wellknown.ProfileItemIds.SportsProfile);
            var profiledByAgeGroup = GetProfiledItems(items, database, "Age Group", Wellknown.ProfileItemIds.AgeGroupProfile);
            var profiledByGender = GetProfiledItems(items, database, "Gender", Wellknown.ProfileItemIds.GenderProfile);

            var profiledItems = new List<ProfiledItem>();
            profiledItems.AddRange(profiledBySports);
            profiledItems.AddRange(profiledByAgeGroup);
            profiledItems.AddRange(profiledByGender);

            // storing matched items as dictionary for lookups
            var itemMap = profiledItems.GroupBy(p => p.Item.ID.Guid)
                                       .ToDictionary(g => g.Key, g => g.First());

            var itemScorings = new List<Tuple<Guid, double>>();
            foreach (var group in profiledItems.GroupBy(p => p.Item.ID.Guid))
            {
                var groupKey = group.Key;
                var sumDistance = 0.0;
                foreach (var scoring in group)
                {
                    sumDistance += 10 - scoring.ProfiledItemCalculation.Distance;
                }

                sumDistance = sumDistance / 3;

                var itemScoring = new Tuple<Guid, double>(groupKey, sumDistance);
                itemScorings.Add(itemScoring);
            }

            return itemScorings.OrderByDescending(i => i.Item2).Select(i => itemMap[i.Item1].Item);
        }

        private IEnumerable<ProfiledItem> GetProfiledItems(IEnumerable<Item> items, [NotNull]Database database, [NotNull] string profileKey, [NotNull] ID profileItemId)
        {
            var trackerProfile = Tracker.Current?.Interaction?.Profiles[profileKey];
            if (trackerProfile == null || trackerProfile.Count <= 0)
            {
                Log.Debug($"RecommendedEventListResolver: Profile key {profileKey} was not found on current tracker", this);
                return Enumerable.Empty<ProfiledItem>();
            }

            var profileItem = database.GetItem(profileItemId);
            if (profileItem == null)
            {
                Log.Warn($"RecommendedEventListResolver: Profile Item not found (id: {profileItemId}", this);
                return Enumerable.Empty<ProfiledItem>();
            }

            var calculator = new DistanceCalculator();
            var collectedProfileItems = items.Select(i => new ProfiledItem(i)).ToList();

            calculator.Calculate(trackerProfile, collectedProfileItems, profileKey, new Analytics.Data.Items.ProfileItem(profileItem));

            return collectedProfileItems.Where(i => i.ProfiledItemCalculation?.Distance < 10);
        }
    }
}