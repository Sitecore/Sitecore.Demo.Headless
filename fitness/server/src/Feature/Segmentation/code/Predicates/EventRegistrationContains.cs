using Sitecore.HabitatHome.Fitness.Foundation.Collection.Model;

namespace Sitecore.HabitatHome.Fitness.Feature.Segmentation.Predicates
{
    public class EventRegistrationContains : BaseStringListFacetPredicate
    {
        protected override string FacetId => FacetIDs.RegisteredEvents;
    }
}