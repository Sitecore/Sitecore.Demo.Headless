using Sitecore.Demo.Fitness.Foundation.Analytics;

namespace Sitecore.Demo.Fitness.Feature.Segmentation.Predicates
{
    public class EventSubscriptionContains : BaseStringListFacetPredicate
    {
        protected override string FacetId => FacetIDs.Subscriptions;
    }
}