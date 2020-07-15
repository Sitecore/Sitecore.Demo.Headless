using System.Web.Mvc;
using Sitecore.Analytics;
using Sitecore.Diagnostics;
using Sitecore.Demo.Fitness.Feature.Personalization.Utils;
using Sitecore.Demo.Fitness.Foundation.Analytics.Services;
using Sitecore.Rules;
using Sitecore.Rules.Conditions;

namespace Sitecore.Demo.Fitness.Feature.Personalization.Rules
{
    public class AgeGroupCondition<T> : OperatorCondition<T> where T : RuleContext
    {
        public string AgeGroupProfileKeyId { get; set; }

        protected override bool Execute(T ruleContext)
        {
            if (!Tracker.Current.IsActive)
            {
                return false;
            }

            var service = DependencyResolver.Current.GetService<IDemographicsService>();

            if (service == null)
            {
                Log.Error("AgeGroupCondition failed. IDemographicsService is not available", this);
                return false;
            }

            var profileKeyName = ProfileExtensions.GetProfileKeyName(AgeGroupProfileKeyId);
            var ageGroup = service.GetAgeGroup();
            var result = profileKeyName.Equals(ageGroup, System.StringComparison.InvariantCultureIgnoreCase);
            Log.Debug($"{this.GetType().Name}: {profileKeyName}.Equals('{ageGroup}', System.StringComparison.InvariantCultureIgnoreCase) = {result}");
            return result;
        }
    }
}