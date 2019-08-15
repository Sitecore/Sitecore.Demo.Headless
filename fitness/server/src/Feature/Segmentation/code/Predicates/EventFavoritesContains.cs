using Sitecore.HabitatHome.Fitness.Foundation.Analytics;

namespace Sitecore.HabitatHome.Fitness.Feature.Segmentation.Predicates
{
    public class EventFavoritesContains : BaseStringListFacetPredicate
    {
        protected override string FacetId => FacetIDs.FavoriteEvents;
    }
}