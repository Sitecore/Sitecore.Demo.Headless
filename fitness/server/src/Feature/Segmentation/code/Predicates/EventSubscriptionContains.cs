using Sitecore.HabitatHome.Fitness.Foundation.Analytics;

namespace Sitecore.HabitatHome.Fitness.Feature.Segmentation.Predicates
{
    public class EventSubscriptionContains : BaseStringListFacetPredicate
    {
        protected override string FacetId => FacetIDs.Subscriptions;
    }
}