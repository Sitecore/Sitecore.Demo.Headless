using Sitecore.Rules;
using Sitecore.Rules.Conditions;
using Sitecore.HabitatHome.Fitness.Collection.Model.Facets;

namespace Sitecore.HabitatHome.Fitness.Personalization.Rules
{
    public class NotificationTopicCondition<T> : OperatorCondition<T> where T : RuleContext
    {
        public string ExpectedTopicKey { get; set; }

        protected override bool Execute(T ruleContext)
        {
            //TODO: get the facet value from where Alex stores it
            //Facet rating = null;
            //var f = Tracker.Current.Contact.GetFacet<Facet>("XConnectFacets");
            //if (f?.TryGetValue(SportExperienceRatings.DefaultKey, out rating) ?? false)

            //TODO: handle case sensitivity
            var topics = new NotificationTopicsFacet();
            return topics?.Values?.Contains(ExpectedTopicKey) ?? false;
        }
    }
}