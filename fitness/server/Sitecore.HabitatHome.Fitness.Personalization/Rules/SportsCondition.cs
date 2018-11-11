using Sitecore.Analytics;
using Sitecore.Diagnostics;
using Sitecore.HabitatHome.Fitness.Collection.Services;
using Sitecore.HabitatHome.Fitness.Personalization.Utils;
using Sitecore.Rules;
using Sitecore.Rules.Conditions;
using System.Web.Mvc;

namespace Sitecore.HabitatHome.Fitness.Personalization.Rules
{
    public class SportsCondition<T> : OperatorCondition<T> where T : RuleContext
    {
        public string SportProfileKeyId { get; set; }

        protected override bool Execute(T ruleContext)
        {
            if (!Tracker.Current.IsActive)
            {
                Log.Error($"{this.GetType().Name} failed. Tracker is not active", this);
                return false;
            }

            var service = DependencyResolver.Current.GetService<ISportsService>();

            if (service == null)
            {
                Log.Error($"{this.GetType().Name} failed. IDemographicsService is not available", this);
                return false;
            }

            var profileKeyName = ProfileExtensions.GetProfileKeyName(SportProfileKeyId);
            var result = false;
            if (!string.IsNullOrWhiteSpace(profileKeyName))
            {
                var facet = service.ReadFacet();
                if (facet != null)
                {
                    result = facet.Ratings.ContainsKey(profileKeyName);
                }
            }

            Log.Debug($"{this.GetType().Name}: facet.Ratings.ContainsKey('{profileKeyName}') = {result}");
            return result;
        }
    }
}