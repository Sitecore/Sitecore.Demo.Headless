using System.Web.Mvc;

namespace Sitecore.HabitatHome.Fitness.Collection
{
    public class Router : IRouter
    {
        public void MapRoutes(System.Web.Routing.RouteCollection routeCollection)
        {
            RouteCollectionExtensions.MapRoute(routeCollection, "habitathome-fitness-sesion", "sitecore/api/habitatfitness/session/{action}", new
            {
                controller = "HabitatFitnessSession",
            });

            RouteCollectionExtensions.MapRoute(routeCollection, "habitathome-fitness-event-favorites", "sitecore/api/habitatfitness/events/favorites/{action}", new
            {
                controller = "HabitatFitnessEventFavorites",
            });

            RouteCollectionExtensions.MapRoute(routeCollection, "habitathome-fitness-event-registration", "sitecore/api/habitatfitness/events/registration/{action}", new
            {
                controller = "HabitatFitnessEventRegistration",
            });

            RouteCollectionExtensions.MapRoute(routeCollection, "habitathome-fitness-subscriptions", "sitecore/api/habitatfitness/subscription/{action}", new
            {
                controller = "HabitatFitnessSubscriptions",
            });

            RouteCollectionExtensions.MapRoute(routeCollection, "habitathome-fitness-demographics", "sitecore/api/habitatfitness/demographics/{action}", new
            {
                controller = "HabitatFitnessDemographics",
            });

            RouteCollectionExtensions.MapRoute(routeCollection, "habitathome-fitness-sports", "sitecore/api/habitatfitness/sports/{action}", new
            {
                controller = "HabitatFitnessSports",
            });

            RouteCollectionExtensions.MapRoute(routeCollection, "habitathome-fitness-identification", "sitecore/api/habitatfitness/identification/{action}", new
            {
                controller = "HabitatFitnessIdentification",
            });
        }
    }

    public interface IRouter
    {
        void MapRoutes(System.Web.Routing.RouteCollection routeCollection);
    }
}