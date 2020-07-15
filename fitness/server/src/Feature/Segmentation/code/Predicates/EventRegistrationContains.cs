using Sitecore.Demo.Fitness.Foundation.Analytics;

namespace Sitecore.Demo.Fitness.Feature.Segmentation.Predicates
{
    public class EventRegistrationContains : BaseStringListFacetPredicate
    {
        protected override string FacetId => FacetIDs.RegisteredEvents;
    }
}