﻿using Sitecore.Analytics;
using Sitecore.Diagnostics;
using Sitecore.LayoutService.Mvc.Routing;
using Sitecore.Mvc.Pipelines.Request.RequestBegin;
using System;
using System.Web.Routing;

namespace Sitecore.HabitatHome.Fitness.Collection.Pipelines.RequestBegin
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
            var contactAlias = queryString["alias"];
            if (!string.IsNullOrWhiteSpace(contactAlias))
            {
                try
                {
                    Tracker.Current?.Session?.IdentifyAs("Alias", contactAlias);
                }
                catch(Exception ex)
                {
                    Log.Error("Unable to set contact identifier", ex, this);
                }
            }
        }
    }
}