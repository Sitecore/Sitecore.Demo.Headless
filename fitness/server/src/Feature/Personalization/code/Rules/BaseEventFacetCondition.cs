using System.Web.Mvc;
using Sitecore.Analytics;
using Sitecore.Data.Items;
using Sitecore.Diagnostics;
using Sitecore.HabitatHome.Fitness.Foundation.Analytics.Services;
using Sitecore.Rules;
using Sitecore.Rules.Conditions;

namespace Sitecore.HabitatHome.Fitness.Feature.Personalization.Rules
{
    public abstract class BaseEventFacetCondition<T> : OperatorCondition<T> where T : RuleContext
    {
        protected abstract string FacetKey { get; }

        public string EventId { get; set; }

        protected override bool Execute(T ruleContext)
        {
            if (!Tracker.Current.IsActive)
            {
                return false;
            }

            var facetService = DependencyResolver.Current.GetService<IStringValueListFacetService>();

            if (facetService == null)
            {
                Log.Error("CurrentEventRegisteredCondition failed. IStringValueListFacetService is not available", this);
                return false;
            }

            Item eventItem = null;
            if (!string.IsNullOrEmpty(EventId))
            {
                eventItem = Context.Database.GetItem(EventId);
            }
            else
            {
                eventItem = Context.Item;
            }

            if (eventItem == null)
            {
                return false;
            }

            if (!eventItem.TemplateID.Equals(Wellknown.TemplateIds.Event))
            {
                return false;
            }

            var eventId = eventItem.ID.Guid.ToString("D");
            var result = facetService.ContainsValue(FacetKey, eventId);
            Log.Debug($"{this.GetType().Name}: facetService.ContainsValue('{FacetKey}', '{eventId}') = {result}");
            return result;
        }
    }
}