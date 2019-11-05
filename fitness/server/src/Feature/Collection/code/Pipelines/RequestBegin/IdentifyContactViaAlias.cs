using System;
using System.Web.Routing;
using Sitecore.Analytics;
using Sitecore.Diagnostics;
using Sitecore.LayoutService.Mvc.Routing;
using Sitecore.Mvc.Pipelines.Request.RequestBegin;

namespace Sitecore.HabitatHome.Fitness.Feature.Collection.Pipelines.RequestBegin
{
    public class IdentifyContactViaAlias : RequestBeginProcessor
    {
        protected readonly IRouteMapper RouteMapper;

        public IdentifyContactViaAlias(IRouteMapper routeMapper)
        {
            Assert.ArgumentNotNull(routeMapper, nameof(routeMapper));
            RouteMapper = routeMapper;
        }

        public override void Process(RequestBeginArgs args)
        {
            RequestContext requestContext = args.PageContext.RequestContext;
            if (requestContext == null || !RouteMapper.IsLayoutServiceRoute(requestContext))
            {
                return;
            }

            var queryString = args.PageContext.RequestContext.HttpContext.Request.QueryString;
            var email = queryString["email"];
            if (!string.IsNullOrWhiteSpace(email))
            {
                try
                {
                    Tracker.Current?.Session?.IdentifyAs(Context.Site.Domain.Name, email);
                }
                catch(Exception ex)
                {
                    Log.Error("Unable to set contact identifier", ex, this);
                }
            }
        }
    }
}