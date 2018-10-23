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
    public class AgeGroupCondition<T> : OperatorCondition<T> where T : RuleContext
    {
        public string AgeGroupProfileKeyId { get; set; }

        protected override bool Execute(T ruleContext)
        {
            if (!Tracker.Current.IsActive)
            {
                return false;
            }

            var facets = Tracker.Current.Contact.GetFacet<IXConnectFacets>("XConnectFacets");
            Facet facet = null;
            if (facets?.Facets?.TryGetValue(DemographicsFacet.DefaultKey, out facet) ?? false)
            {
                var demographicsFacet = facet as DemographicsFacet;
                var ageGroup = demographicsFacet?.AgeGroup;
                return GetProfileKeyName().Equals(ageGroup, System.StringComparison.InvariantCultureIgnoreCase);
            }

            return false;
        }

        private string GetProfileKeyName()
        {
            var profileKeyItem = Context.Database.GetItem(AgeGroupProfileKeyId);
            if (profileKeyItem == null)
            {
                Log.Warn($"SportsCondition: Unable to resolve profile key item {AgeGroupProfileKeyId}", this);
            }

            return new ProfileKeyItem(profileKeyItem).KeyName;
        }
    }
}