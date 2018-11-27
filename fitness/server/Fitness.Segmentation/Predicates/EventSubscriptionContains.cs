using Sitecore.HabitatHome.Fitness.Collection.Model;

namespace Sitecore.HabitatHome.Fitness.Segmentation.Predicates
{
    public class EventSubscriptionContains : BaseStringListFacetPredicate
    {
        protected override string FacetId => FacetIDs.Subscriptions;
    }
}