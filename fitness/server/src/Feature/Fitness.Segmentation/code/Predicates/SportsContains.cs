using System;
using System.Linq;
using System.Linq.Expressions;
using Sitecore.XConnect;
using Sitecore.XConnect.Segmentation.Predicates;
using Sitecore.HabitatHome.Fitness.Collection.Model.Facets;
using Sitecore.Framework.Rules;

namespace Sitecore.HabitatHome.Fitness.Segmentation.Predicates
{
    public class SportsContains : ICondition, IContactSearchQueryFactory
    {
        public string SportName { get; set; }

        public bool Evaluate(IRuleExecutionContext context)
        {
            return context.Fact<Contact>().GetFacet<SportsFacet>(SportsFacet.DefaultKey).Ratings.Keys.Any(key => key == SportName);
        }

        public Expression<Func<Contact, bool>> CreateContactSearchQuery(IContactSearchQueryContext context)
        {
            // This is duplicating the Evaluate method on purpose
            // Do not modify this expression, segmentation engine doesn't like it
            return contact => contact.GetFacet<SportsFacet>(SportsFacet.DefaultKey).Ratings.Keys.Any(key => key == SportName);
        }
    }
}