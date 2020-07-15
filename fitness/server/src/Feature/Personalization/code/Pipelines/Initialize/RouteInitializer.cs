using System.Web.Routing;
using Sitecore.Pipelines;

namespace Sitecore.Demo.Fitness.Feature.Personalization.Pipelines.Initialize
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