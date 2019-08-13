using System.Web.Mvc;

namespace Sitecore.HabitatHome.Fitness.Feature.Personalization
{
    public class Router : IRouter
    {
        public void MapRoutes(System.Web.Routing.RouteCollection routeCollection)
        {
            RouteCollectionExtensions.MapRoute(routeCollection, "habitathome-fitness-events", "sitecore/api/habitatfitness/events/{action}", new
            {
                action = "Index",
                controller = "HabitatFitnessEvents",
            });

            RouteCollectionExtensions.MapRoute(routeCollection, "habitathome-fitness-products", "sitecore/api/habitatfitness/products/{action}", new
            {
                action = "Index",
                controller = "HabitatFitnessProducts",
            });
        }
    }

    public interface IRouter
    {
        void MapRoutes(System.Web.Routing.RouteCollection routeCollection);
    }
}