using Sitecore.Pipelines;
using System.Web.Routing;

namespace Sitecore.HabitatHome.Fitness.Foundation.Collection.Pipelines.Initialize
{
    public class RouteInitializer
    {
        protected readonly IRouter Router;

        public RouteInitializer(IRouter router)
        {
            Router = router;
        }

        public virtual void Process(PipelineArgs args)
        {
            Router.MapRoutes(RouteTable.Routes);
        }
    }
}