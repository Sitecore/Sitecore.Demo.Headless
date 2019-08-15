using System.Web.Mvc;
using Sitecore.Analytics;
using Sitecore.Diagnostics;
using Sitecore.HabitatHome.Fitness.Feature.Personalization.Utils;
using Sitecore.HabitatHome.Fitness.Foundation.Collection.Model.Services;
using Sitecore.Rules;
using Sitecore.Rules.Conditions;

namespace Sitecore.HabitatHome.Fitness.Feature.Personalization.Rules
{
    public class SportsSkillCondition<T> : OperatorCondition<T> where T : RuleContext
    {
        public string SportProfileKeyId { get; set; }

        public int SkillLevel { get; set; }

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
                Log.Error($"{this.GetType().Name} failed. ISportsService is not available", this);
                return false;
            }

            var profileKeyName = ProfileExtensions.GetProfileKeyName(SportProfileKeyId);
            var result = false;
            var sportSkillLevel = 0;
            if (!string.IsNullOrWhiteSpace(profileKeyName))
            {
                var facet = service.ReadFacet();
                if (facet != null && facet.Ratings.ContainsKey(profileKeyName))
                {
                    sportSkillLevel = facet.Ratings[profileKeyName];
                    result = CompareSkillLevel(sportSkillLevel);
                }
            }

            Log.Debug($"{this.GetType().Name}: '{sportSkillLevel}' {GetOperator()} '{SkillLevel}' = {result}");
            return result;
        }

        private bool CompareSkillLevel(int skillLevel)
        {
            var op = GetOperator();

            switch (op)
            {
                case ConditionOperator.Equal:
                    return skillLevel == SkillLevel;

                case ConditionOperator.GreaterThanOrEqual:
                    return skillLevel >= SkillLevel;

                case ConditionOperator.GreaterThan:
                    return skillLevel > SkillLevel;

                case ConditionOperator.LessThanOrEqual:
                    return skillLevel <= SkillLevel;

                case ConditionOperator.LessThan:
                    return skillLevel < SkillLevel;

                case ConditionOperator.NotEqual:
                    return skillLevel != SkillLevel;
                default:
                    return false;
            }
        }
    }
}


//var actualSkillLevel = facetRating.Ratings[profileKey];

//                var op = GetOperator();

//                switch (op)
//                {
//                    case ConditionOperator.Equal:
//                        return actualSkillLevel == SkillLevel;

//                    case ConditionOperator.GreaterThanOrEqual:
//                        return actualSkillLevel >= SkillLevel;

//                    case ConditionOperator.GreaterThan:
//                        return actualSkillLevel > SkillLevel;

//                    case ConditionOperator.LessThanOrEqual:
//                        return actualSkillLevel <= SkillLevel;

//                    case ConditionOperator.LessThan:
//                        return actualSkillLevel < SkillLevel;

//                    case ConditionOperator.NotEqual:
//                        return actualSkillLevel != SkillLevel;
//                }