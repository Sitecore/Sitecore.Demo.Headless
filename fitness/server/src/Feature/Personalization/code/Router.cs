using System.Web.Mvc;

namespace Sitecore.Demo.Fitness.Feature.Personalization
{
    public class Router : IRouter
    {
        public void MapRoutes(System.Web.Routing.RouteCollection routeCollection)
        {
            RouteCollectionExtensions.MapRoute(routeCollection, "lighthouse-fitness-events", "sitecore/api/lighthousefitness/events/{action}", new
            {
                action = "Index",
                controller = "LighthouseFitnessEvents",
            });

            RouteCollectionExtensions.MapRoute(routeCollection, "lighthouse-fitness-products", "sitecore/api/lighthousefitness/products/{action}", new
            {
                action = "Index",
                controller = "LighthouseFitnessProducts",
            });

            RouteCollectionExtensions.MapRoute(routeCollection, "lighthouse-fitness-boxever", "sitecore/api/lighthousefitness/boxever/{action}", new
            {
                action = "Index",
                controller = "LighthouseFitnessBoxever",
            });
        }
    }

    public interface IRouter
    {
        void MapRoutes(System.Web.Routing.RouteCollection routeCollection);
    }
}