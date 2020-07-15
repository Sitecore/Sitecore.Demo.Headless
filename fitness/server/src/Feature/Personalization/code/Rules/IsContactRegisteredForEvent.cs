using Sitecore.Demo.Fitness.Foundation.Analytics;
using Sitecore.Rules;

namespace Sitecore.Demo.Fitness.Feature.Personalization.Rules
{
    public class IsContactRegisteredForEvent<T> : BaseEventFacetCondition<T> where T : RuleContext
    {
        protected override string FacetKey { get { return FacetIDs.RegisteredEvents; } }
    }
}