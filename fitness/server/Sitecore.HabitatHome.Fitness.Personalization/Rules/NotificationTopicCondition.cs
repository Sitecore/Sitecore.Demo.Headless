using Sitecore.Rules;
using Sitecore.Rules.Conditions;

namespace Sitecore.HabitatHome.Fitness.Personalization.Rules
{
    public class NotificationTopicCondition<T> : OperatorCondition<T> where T : RuleContext
    {
        public string ExpectedTopicKey { get; set; }

        protected override bool Execute(T ruleContext)
        {
            return false;
        }
    }
}