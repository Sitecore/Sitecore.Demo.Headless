using Sitecore.HabitatHome.Fitness.Collection.Model;

namespace Sitecore.HabitatHome.Fitness.Segmentation.Predicates
{
    public class EventRegistrationContains : BaseStringListFacetPredicate
    {
        protected override string FacetId => FacetIDs.RegisteredEvents;
    }
}