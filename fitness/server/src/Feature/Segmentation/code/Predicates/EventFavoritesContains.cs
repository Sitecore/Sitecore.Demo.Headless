using Sitecore.Demo.Fitness.Foundation.Analytics;

namespace Sitecore.Demo.Fitness.Feature.Segmentation.Predicates
{
    public class EventFavoritesContains : BaseStringListFacetPredicate
    {
        protected override string FacetId => FacetIDs.FavoriteEvents;
    }
}