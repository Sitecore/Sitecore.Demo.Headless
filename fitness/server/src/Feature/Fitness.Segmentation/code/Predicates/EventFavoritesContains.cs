using Sitecore.HabitatHome.Fitness.Foundation.Collection.Model;

namespace Sitecore.HabitatHome.Fitness.Feature.Segmentation.Predicates
{
    public class EventFavoritesContains : BaseStringListFacetPredicate
    {
        protected override string FacetId => FacetIDs.FavoriteEvents;
    }
}