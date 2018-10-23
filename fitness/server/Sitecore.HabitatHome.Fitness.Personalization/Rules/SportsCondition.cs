using Sitecore.Analytics;
using Sitecore.Analytics.Data.Items;
using Sitecore.Analytics.XConnect.Facets;
using Sitecore.Diagnostics;
using Sitecore.HabitatHome.Fitness.Collection.Model.Facets;
using Sitecore.Rules;
using Sitecore.Rules.Conditions;
using Sitecore.XConnect;

namespace Sitecore.HabitatHome.Fitness.Personalization.Rules
{
    public class SportsCondition<T> : OperatorCondition<T> where T : RuleContext
    {
        public string SportProfileKeyId { get; set; }

        protected override bool Execute(T ruleContext)
        {
            if (!Tracker.Current.IsActive)
            {
                return false;
            }

            var facets = Tracker.Current.Contact.GetFacet<IXConnectFacets>("XConnectFacets");
            Facet facet = null;
            if (facets?.Facets?.TryGetValue(SportsFacet.DefaultKey, out facet) ?? false)
            {
                var facetRating = facet as SportsFacet;
                return facetRating?.Ratings?.ContainsKey(GetProfileKeyName()) ?? false;
            }

            return false;
        }

        private string GetProfileKeyName()
        {
            var profileKeyItem = Context.Database.GetItem(SportProfileKeyId);
            if(profileKeyItem == null)
            {
                Log.Warn($"SportsCondition: Unable to resolve profile key item {SportProfileKeyId}", this);
            }

            return new ProfileKeyItem(profileKeyItem).KeyName;
        }
    }
}