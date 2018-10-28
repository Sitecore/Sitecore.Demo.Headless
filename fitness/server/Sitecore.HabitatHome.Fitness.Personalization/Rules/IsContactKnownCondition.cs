using Sitecore.Analytics;
using Sitecore.Rules;
using Sitecore.Rules.Conditions;

namespace Sitecore.HabitatHome.Fitness.Personalization.Rules
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
            return contact == null ? false : contact.IdentificationLevel == Analytics.Model.ContactIdentificationLevel.Known;
        }
    }
}