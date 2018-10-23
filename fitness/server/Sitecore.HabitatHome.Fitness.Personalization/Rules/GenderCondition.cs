using Sitecore.Analytics;
using Sitecore.Analytics.Data.Items;
using Sitecore.Analytics.XConnect.Facets;
using Sitecore.Diagnostics;
using Sitecore.Rules;
using Sitecore.Rules.Conditions;
using Sitecore.XConnect;
using Sitecore.XConnect.Collection.Model;

namespace Sitecore.HabitatHome.Fitness.Personalization.Rules
{
    public class GenderCondition<T> : OperatorCondition<T> where T : RuleContext
    {
        public string GenderProfileKeyId { get; set; }

        protected override bool Execute(T ruleContext)
        {
            if (!Tracker.Current.IsActive)
            {
                return false;
            }

            var facets = Tracker.Current.Contact.GetFacet<IXConnectFacets>("XConnectFacets");
            Facet facet = null;
            if (facets?.Facets?.TryGetValue(PersonalInformation.DefaultFacetKey, out facet) ?? false)
            {
                var personalFacet = facet as PersonalInformation;
                var gender = personalFacet?.Gender;
                return GetProfileKeyName().Equals(gender, System.StringComparison.InvariantCultureIgnoreCase);
            }

            return false;
        }

        private string GetProfileKeyName()
        {
            var profileKeyItem = Context.Database.GetItem(GenderProfileKeyId);
            if (profileKeyItem == null)
            {
                Log.Warn($"SportsCondition: Unable to resolve profile key item {GenderProfileKeyId}", this);
            }

            return new ProfileKeyItem(profileKeyItem).KeyName;
        }
    }
}