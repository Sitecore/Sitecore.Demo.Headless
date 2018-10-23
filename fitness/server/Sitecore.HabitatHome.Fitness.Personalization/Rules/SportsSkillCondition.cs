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
    public class SportsSkillCondition<T> : OperatorCondition<T> where T : RuleContext
    {
        public string SportProfileKeyId { get; set; }

        public int SkillLevel { get; set; }

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

                var profileKey = GetProfileKeyName();
                var containsSportKey = facetRating?.Ratings?.ContainsKey(profileKey) ?? false;
                if (!containsSportKey)
                {
                    return false;
                }

                var actualSkillLevel = facetRating.Ratings[profileKey];

                var op = GetOperator();

                switch (op)
                {
                    case ConditionOperator.Equal:
                        return actualSkillLevel == SkillLevel;

                    case ConditionOperator.GreaterThanOrEqual:
                        return actualSkillLevel >= SkillLevel;

                    case ConditionOperator.GreaterThan:
                        return actualSkillLevel > SkillLevel;

                    case ConditionOperator.LessThanOrEqual:
                        return actualSkillLevel <= SkillLevel;

                    case ConditionOperator.LessThan:
                        return actualSkillLevel < SkillLevel;

                    case ConditionOperator.NotEqual:
                        return actualSkillLevel != SkillLevel;
                }
            }

            return false;
        }

        private string GetProfileKeyName()
        {
            var profileKeyItem = Context.Database.GetItem(SportProfileKeyId);
            if (profileKeyItem == null)
            {
                Log.Warn($"SportsCondition: Unable to resolve profile key item {SportProfileKeyId}", this);
            }

            return new ProfileKeyItem(profileKeyItem).KeyName;
        }
    }
}