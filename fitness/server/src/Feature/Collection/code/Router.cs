using System.Web.Mvc;

namespace Sitecore.Demo.Fitness.Feature.Collection
{
    public class Router : IRouter
    {
        public void MapRoutes(System.Web.Routing.RouteCollection routeCollection)
        {
            RouteCollectionExtensions.MapRoute(routeCollection, "lighthouse-fitness-sesion", "sitecore/api/lighthousefitness/session/{action}", new
            {
                controller = "LighthouseFitnessSession",
            });

            RouteCollectionExtensions.MapRoute(routeCollection, "lighthouse-fitness-event-favorites", "sitecore/api/lighthousefitness/events/favorites/{action}", new
            {
                controller = "LighthouseFitnessEventFavorites",
            });

            RouteCollectionExtensions.MapRoute(routeCollection, "lighthouse-fitness-event-registration", "sitecore/api/lighthousefitness/events/registration/{action}", new
            {
                controller = "LighthouseFitnessEventRegistration",
            });

            RouteCollectionExtensions.MapRoute(routeCollection, "lighthouse-fitness-subscriptions", "sitecore/api/lighthousefitness/subscription/{action}", new
            {
                controller = "LighthouseFitnessSubscriptions",
            });

            RouteCollectionExtensions.MapRoute(routeCollection, "lighthouse-fitness-demographics", "sitecore/api/lighthousefitness/demographics/{action}", new
            {
                controller = "LighthouseFitnessDemographics",
            });

            RouteCollectionExtensions.MapRoute(routeCollection, "lighthouse-fitness-sports", "sitecore/api/lighthousefitness/sports/{action}", new
            {
                controller = "LighthouseFitnessSports",
            });

            RouteCollectionExtensions.MapRoute(routeCollection, "lighthouse-fitness-identification", "sitecore/api/lighthousefitness/identification/{action}", new
            {
                controller = "LighthouseFitnessIdentification",
            });
        }
    }

    public interface IRouter
    {
        void MapRoutes(System.Web.Routing.RouteCollection routeCollection);
    }
}