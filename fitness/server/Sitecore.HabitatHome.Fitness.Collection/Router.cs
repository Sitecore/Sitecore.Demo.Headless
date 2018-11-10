using System.Web.Mvc;

namespace Sitecore.HabitatHome.Fitness.Collection
{
    public class Router : IRouter
    {
        public void MapRoutes(System.Web.Routing.RouteCollection routeCollection)
        {
            RouteCollectionExtensions.MapRoute(routeCollection, "habitathome-fitness-api", "sitecore/api/habitatfitness/{action}", new
            {
                controller = "HabitatFitnessEvents",
            });

            RouteCollectionExtensions.MapRoute(routeCollection, "habitathome-fitness-event-favorites-api", "sitecore/api/habitatfitness/events/favorites/{action}", new
            {
                controller = "HabitatFitnessEventFavorites",
            });

            RouteCollectionExtensions.MapRoute(routeCollection, "habitathome-fitness-event-registration-api", "sitecore/api/habitatfitness/events/registration/{action}", new
            {
                controller = "HabitatFitnessEventRegistration",
            });

            RouteCollectionExtensions.MapRoute(routeCollection, "habitathome-fitness-subscription-api", "sitecore/api/habitatfitness/subscription/{action}", new
            {
                controller = "HabitatFitnessSubscriptions",
            });
        }
    }

    public interface IRouter
    {
        void MapRoutes(System.Web.Routing.RouteCollection routeCollection);
    }
}