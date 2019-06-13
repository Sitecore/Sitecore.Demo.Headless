using Sitecore.HabitatHome.Fitness.Collection.Model;
using Sitecore.Rules;

namespace Sitecore.HabitatHome.Fitness.Personalization.Rules
{
    public class IsContactRegisteredForEvent<T> : BaseEventFacetCondition<T> where T : RuleContext
    {
        protected override string FacetKey { get { return FacetIDs.RegisteredEvents; } }
    }
}