using Sitecore.Analytics;
using Sitecore.HabitatHome.Fitness.Collection.Model.Facets;
using Sitecore.Rules;
using Sitecore.Rules.Conditions;
using Sitecore.XConnect;

namespace Sitecore.HabitatHome.Fitness.Personalization.Rules
{
    public class NotificationSubscriptionCondition<T> : OperatorCondition<T> where T : RuleContext
    {
        public string ExpectedNotificationKey { get; set; }

        protected override bool Execute(T ruleContext)
        {
            //TODO: get the facet value from where Alex stores it
            //Facet rating = null;
            //var f = Tracker.Current.Contact.GetFacet<Facet>("XConnectFacets");
            //if (f?.TryGetValue(SportExperienceRatings.DefaultKey, out rating) ?? false)

            //TODO: handle case sensitivity
            var subscriptions = new NotificationSubscriptionsFacet();
            return subscriptions?.Values?.Contains(ExpectedNotificationKey) ?? false;
        }
    }
}