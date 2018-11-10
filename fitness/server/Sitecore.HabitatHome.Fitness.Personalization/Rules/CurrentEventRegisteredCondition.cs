using Sitecore.Analytics;
using Sitecore.Analytics.XConnect.Facets;
using Sitecore.HabitatHome.Fitness.Collection.Model;
using Sitecore.HabitatHome.Fitness.Collection.Model.Facets;
using Sitecore.Rules;
using Sitecore.Rules.Conditions;
using Sitecore.XConnect;

namespace Sitecore.HabitatHome.Fitness.Personalization.Rules
{
    public class CurrentEventRegisteredCondition<T> : OperatorCondition<T> where T : RuleContext
    {
        public string GenderProfileKeyId { get; set; }

        protected override bool Execute(T ruleContext)
        {
            if (!Tracker.Current.IsActive)
            {
                return false;
            }

            var contextItem = Context.Item;
            if (contextItem == null)
            {
                return false;
            }
            var eventId = contextItem.ID.Guid.ToString("D");

            var facets = Tracker.Current.Contact.GetFacet<IXConnectFacets>("XConnectFacets");
            Facet facet = null;
            if (facets?.Facets?.TryGetValue(FacetIDs.RegisteredEvents, out facet) ?? false)
            {
                if (facet is StringValueListFacet registeredEventFacet)
                {
                    return registeredEventFacet.Values.Contains(eventId);
                }
            }
            return false;
        }
    }
}