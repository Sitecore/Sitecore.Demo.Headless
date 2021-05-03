using System;
using Sitecore.Diagnostics;
using Sitecore.JavaScriptServices.Configuration;
using Sitecore.LayoutService.ItemRendering.Pipelines.GetLayoutServiceContext;

namespace Sitecore.Demo.Fitness.Feature.Personalization.Pipelines.GetLayoutServiceContext
{
    public class EventInfo : Sitecore.JavaScriptServices.ViewEngine.LayoutService.Pipelines.GetLayoutServiceContext.JssGetLayoutServiceContextProcessor
    {
        public EventInfo(IConfigurationResolver configurationResolver) : base(configurationResolver)
        {
        }

        protected override void DoProcess(GetLayoutServiceContextArgs args, AppConfiguration application)
        {
            if (args.RenderedItem == null)
            {
                return;
            }

            if (args.RenderedItem.TemplateID.Equals(Wellknown.TemplateIds.Event))
            {
                var eventId = args.RenderedItem.ID.Guid.ToString("D");
                try
                {
                    // TODO: Refactor
                    var favorited = false; // facetService.ContainsValue(FacetIDs.FavoriteEvents, eventId);
                    var registered = false; // facetService.ContainsValue(FacetIDs.RegisteredEvents, eventId);
                    var subscribed = false; // facetService.ContainsValue(FacetIDs.Subscriptions, eventId);

                    args.ContextData.Add("event",
                        new
                        {
                            favorited,
                            subscribed,
                            registered
                        });
                }
                catch (Exception ex)
                {
                    args.ContextData.Add("event", new { });
                    Log.Error("GetLayoutServiceContext.EventInfo processor terminates.", ex, this);
                }
            }
        }
    }
}