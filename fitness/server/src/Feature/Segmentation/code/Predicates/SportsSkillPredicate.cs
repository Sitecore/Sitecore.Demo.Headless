using System;
using System.Linq;
using System.Linq.Expressions;
using Sitecore.Framework.Rules;
using Sitecore.HabitatHome.Fitness.Foundation.Analytics.Facets;
using Sitecore.XConnect;
using Sitecore.XConnect.Segmentation.Predicates;

namespace Sitecore.HabitatHome.Fitness.Feature.Segmentation.Predicates
{
    public class SportsSkillPredicate : ICondition, IContactSearchQueryFactory
    {
        public string SportName { get; set; }

        public int SkillLevel { get; set; }

        public NumericOperationType Comparison { get; set; }

        public bool Evaluate(IRuleExecutionContext context)
        {
            return context.Fact<Contact>().GetFacet<SportsFacet>(SportsFacet.DefaultKey).Ratings.Any(r => r.Key == SportName && Comparison.Evaluate(r.Value, SkillLevel));
        }

        public Expression<Func<Contact, bool>> CreateContactSearchQuery(IContactSearchQueryContext context)
        {
            // This is duplicating the Evaluate method on purpose
            // Do not modify this expression, segmentation engine doesn't like it
            return contact => contact.GetFacet<SportsFacet>(SportsFacet.DefaultKey).Ratings.Any(r => r.Key == SportName && Comparison.Evaluate(r.Value, SkillLevel));
        }
    }
}