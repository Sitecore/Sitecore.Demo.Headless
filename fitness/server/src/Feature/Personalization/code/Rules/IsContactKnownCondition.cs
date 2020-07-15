using Sitecore.Analytics;
using Sitecore.Diagnostics;
using Sitecore.Rules;
using Sitecore.Rules.Conditions;

namespace Sitecore.Demo.Fitness.Feature.Personalization.Rules
{
    public class IsContactKnownCondition<T> : OperatorCondition<T> where T : RuleContext
    {
        public string GenderProfileKeyId { get; set; }

        protected override bool Execute(T ruleContext)
        {
            if (Tracker.Current == null || !Tracker.Current.IsActive)
            {
                return false;
            }  
            var contact = Tracker.Current?.Contact;
            var result = contact == null ? false : contact.IdentificationLevel == Analytics.Model.ContactIdentificationLevel.Known;
            Log.Debug($"{this.GetType().Name}: {contact.IdentificationLevel} == Analytics.Model.ContactIdentificationLevel.Known = {result}");
            return result;
        }
    }
}