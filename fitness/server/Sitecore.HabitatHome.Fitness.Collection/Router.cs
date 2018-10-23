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
        }
    }

    public interface IRouter
    {
        void MapRoutes(System.Web.Routing.RouteCollection routeCollection);
    }
}