using Sitecore.Analytics;
using Sitecore.Analytics.XConnect.Facets;
using Sitecore.HabitatHome.Fitness.Collection.Model.Facets;
using Sitecore.JavaScriptServices.Configuration;
using Sitecore.LayoutService.ItemRendering.Pipelines.GetLayoutServiceContext;
using Sitecore.XConnect;

namespace Sitecore.HabitatHome.Fitness.Personalization.Pipelines.GetLayoutServiceContext
{
    public class EventInfo : Sitecore.JavaScriptServices.ViewEngine.LayoutService.Pipelines.GetLayoutServiceContext.JssGetLayoutServiceContextProcessor
    {
        public EventInfo(IConfigurationResolver configurationResolver) : base(configurationResolver)
        {
        }

        protected override void DoProcess(GetLayoutServiceContextArgs args, AppConfiguration application)
        {
            if (args.RenderedItem.TemplateID.Equals(Wellknown.TemplateIds.Event))
            {
                var contact = GetContact();
                var eventId = args.RenderedItem.ID.Guid.ToString("D");

                if (contact != null)
                {
                    var facets = contact.GetFacet<IXConnectFacets>("XConnectFacets");
                    Facet facet = null;
                    var favorited = false;
                    if (facets?.Facets?.TryGetValue(FavoriteEventsFacet.DefaultKey, out facet) ?? false)
                    {
                        var eventFavoritesFacet = facet as FavoriteEventsFacet;
                        var favorites = eventFavoritesFacet?.Values;
                        favorited = favorites.Contains(eventId);
                    }

                    var registered = false;
                    if (facets?.Facets?.TryGetValue(RegisteredEventsFacet.DefaultKey, out facet) ?? false)
                    {
                        var registeredEventFacet = facet as RegisteredEventsFacet;
                        registered = registeredEventFacet.Values.Contains(eventId);
                    }

                    var subscribed = false;
                    // TODO: subscription facet read out
                    //if (facets?.Facets?.TryGetValue(RegisteredEventsFacet.DefaultKey, out facet) ?? false)
                    //{
                    //    var registeredEventFacet = facet as RegisteredEventsFacet;
                    //    var eventId = contextItem.ID.Guid.ToString("D");
                    //    return registeredEventFacet.Values.Contains(eventId);
                    //}

                    args.ContextData.Add("event",
                        new
                        {
                            favorited,
                            subscribed,
                            registered
                        });
                }
            }
        }

        protected Analytics.Tracking.Contact GetContact()
        {
            return Tracker.Current != null && Tracker.IsActive ? Tracker.Current?.Contact : null;
        }
    }
}