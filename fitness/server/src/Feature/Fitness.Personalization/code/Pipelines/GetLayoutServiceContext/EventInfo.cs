using System;
using Sitecore.Diagnostics;
using Sitecore.HabitatHome.Fitness.Foundation.Collection.Model;
using Sitecore.HabitatHome.Fitness.Foundation.Collection.Services;
using Sitecore.JavaScriptServices.Configuration;
using Sitecore.LayoutService.ItemRendering.Pipelines.GetLayoutServiceContext;

namespace Sitecore.HabitatHome.Fitness.Feature.Personalization.Pipelines.GetLayoutServiceContext
{
    public class EventInfo : Sitecore.JavaScriptServices.ViewEngine.LayoutService.Pipelines.GetLayoutServiceContext.JssGetLayoutServiceContextProcessor
    {
        private IStringValueListFacetService facetService;

        public EventInfo(IConfigurationResolver configurationResolver, IStringValueListFacetService facetService) : base(configurationResolver)
        {
            this.facetService = facetService;
        }

        protected override void DoProcess(GetLayoutServiceContextArgs args, AppConfiguration application)
        {
            if (facetService == null)
            {
                Log.Fatal("GetLayoutServiceContext.EventInfo processor terimates. Must have an instance of IStringValueListFacetService resolved", this);
                return;
            }

            if (args.RenderedItem == null)
            {
                return;
            }

            if (args.RenderedItem.TemplateID.Equals(Wellknown.TemplateIds.Event))
            {
                var eventId = args.RenderedItem.ID.Guid.ToString("D");
                try
                {
                    var favorited = facetService.ContainsValue(FacetIDs.FavoriteEvents, eventId);
                    var registered = facetService.ContainsValue(FacetIDs.RegisteredEvents, eventId);
                    var subscribed = facetService.ContainsValue(FacetIDs.Subscriptions, eventId);

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
                    Log.Error("GetLayoutServiceContext.EventInfo processor terimates.", ex, this);
                }
            }
        }
    }
}