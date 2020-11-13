using System;
using System.Collections.Generic;
using System.Linq;
using Sitecore.Analytics;
using Sitecore.Annotations;
using Sitecore.Data;
using Sitecore.Data.Items;
using Sitecore.Diagnostics;
using Sitecore.Demo.Fitness.Foundation.Analytics.Facets;

namespace Sitecore.Demo.Fitness.Feature.Personalization.Services
{
    public class ItemScoringService: IItemScoringService
    {
        public IEnumerable<Item> ScoreItems([NotNull]IEnumerable<Item> items, [NotNull]Database database)
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

                var averageDistance = sumDistance / 3;
                var itemScoring = new Tuple<Guid, double>(groupKey, averageDistance);
                itemScorings.Add(itemScoring);
            }

            return itemScorings.OrderByDescending(i => i.Item2).Select(i => itemMap[i.Item1].Item);
        }

        private IEnumerable<ProfiledItem> GetProfiledItems(IEnumerable<Item> items, [NotNull]Database database, [NotNull] string profileKey, [NotNull] ID profileItemId)
        {
            var trackerProfile = Tracker.Current?.Interaction?.Profiles[profileKey];
            if (trackerProfile == null || trackerProfile.Count <= 0)
            {
                Log.Debug($"ItemScorer: Profile key {profileKey} was not found on current tracker", this);
                return Enumerable.Empty<ProfiledItem>();
            }

            var profileItem = database.GetItem(profileItemId);
            if (profileItem == null)
            {
                Log.Warn($"ItemScorer: Profile Item not found (id: {profileItemId}", this);
                return Enumerable.Empty<ProfiledItem>();
            }

            var calculator = new DistanceCalculator();
            var collectedProfileItems = items.Select(i => new ProfiledItem(i)).ToList();

            calculator.Calculate(trackerProfile, collectedProfileItems, profileKey, new Analytics.Data.Items.ProfileItem(profileItem));

            return collectedProfileItems.Where(i => i.ProfiledItemCalculation?.Distance <= 100);
        }
    }
}