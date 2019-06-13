using Sitecore.Analytics;
using Sitecore.Analytics.Data.Items;
using Sitecore.Analytics.XConnect.Facets;
using Sitecore.Diagnostics;
using Sitecore.HabitatHome.Fitness.Collection.Services;
using Sitecore.HabitatHome.Fitness.Personalization.Utils;
using Sitecore.Rules;
using Sitecore.Rules.Conditions;
using Sitecore.XConnect;
using Sitecore.XConnect.Collection.Model;
using System.Web.Mvc;

namespace Sitecore.HabitatHome.Fitness.Personalization.Rules
{
    public class GenderCondition<T> : OperatorCondition<T> where T : RuleContext
    {
        public string GenderProfileKeyId { get; set; }

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

            var profileKeyName = ProfileExtensions.GetProfileKeyName(GenderProfileKeyId);
            var gender = service.GetGender();
            var result = profileKeyName.Equals(gender, System.StringComparison.InvariantCultureIgnoreCase);
            Log.Debug($"{this.GetType().Name}: {profileKeyName}.Equals('{gender}', System.StringComparison.InvariantCultureIgnoreCase) = {result}");
            return result;
        }
    }
}