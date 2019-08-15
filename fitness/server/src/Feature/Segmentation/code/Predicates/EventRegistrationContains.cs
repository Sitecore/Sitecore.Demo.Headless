using Sitecore.HabitatHome.Fitness.Foundation.Analytics;

namespace Sitecore.HabitatHome.Fitness.Feature.Segmentation.Predicates
{
    public class EventRegistrationContains : BaseStringListFacetPredicate
    {
        protected override string FacetId => FacetIDs.RegisteredEvents;
    }
}