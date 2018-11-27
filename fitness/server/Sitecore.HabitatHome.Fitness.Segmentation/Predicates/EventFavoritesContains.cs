using Sitecore.HabitatHome.Fitness.Collection.Model;

namespace Sitecore.HabitatHome.Fitness.Segmentation.Predicates
{
    public class EventFavoritesContains : BaseStringListFacetPredicate
    {
        protected override string FacetId => FacetIDs.FavoriteEvents;
    }
}