using Sitecore.HabitatHome.Fitness.Foundation.Analytics;
using Sitecore.Rules;

namespace Sitecore.HabitatHome.Fitness.Feature.Personalization.Rules
{
    public class IsContactFavoritedEvent<T> : BaseEventFacetCondition<T> where T : RuleContext
    {
        protected override string FacetKey { get { return FacetIDs.FavoriteEvents; } }
    }
}