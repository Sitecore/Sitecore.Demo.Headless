using Sitecore.Analytics.Tracking.Identification;
using Sitecore.Diagnostics;
using Sitecore.LayoutService.Mvc.Routing;
using Sitecore.Mvc.Pipelines.Request.RequestBegin;
using System;
using System.Web.Routing;

namespace Sitecore.Demo.Fitness.Feature.Collection.Pipelines.RequestBegin
{
    public class IdentifyContactViaAlias : RequestBeginProcessor
    {
        protected readonly IRouteMapper RouteMapper;
        protected readonly IContactIdentificationManager ContactIdentificationManager;

        public IdentifyContactViaAlias(IRouteMapper routeMapper, IContactIdentificationManager contactIdentificationManager)
        {
            Assert.ArgumentNotNull(routeMapper, nameof(routeMapper));
            Assert.ArgumentNotNull(routeMapper, nameof(contactIdentificationManager));

            RouteMapper = routeMapper;
            ContactIdentificationManager = contactIdentificationManager;
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
                    IdentificationResult result = ContactIdentificationManager.IdentifyAs(new KnownContactIdentifier(Context.Site.Domain.Name, email));
                    if (!result.Success)
                    {
                        Log.Error("Unable to set contact identifier", this);
                    }
                }
                catch (Exception ex)
                {
                    Log.Error("Unable to set contact identifier", ex, this);
                }
            }
        }
    }
}