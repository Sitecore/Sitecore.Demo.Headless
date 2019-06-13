using System;
using System.Linq;
using System.Linq.Expressions;
using Sitecore.XConnect;
using Sitecore.XConnect.Segmentation.Predicates;
using Sitecore.HabitatHome.Fitness.Collection.Model.Facets;
using Sitecore.Framework.Rules;

namespace Sitecore.HabitatHome.Fitness.Segmentation.Predicates
{
    public abstract class BaseStringListFacetPredicate : ICondition, IContactSearchQueryFactory
    {
        protected abstract string FacetId { get; }

        public Guid EventId { get; set; }

        public string EventIdFormatted { get { return EventId.ToString("D"); } }

        public bool Evaluate(IRuleExecutionContext context)
        {
            return context.Fact<Contact>().GetFacet<StringValueListFacet>(FacetId).Values.Any(key => key == EventIdFormatted);
        }

        public Expression<Func<Contact, bool>> CreateContactSearchQuery(IContactSearchQueryContext context)
        {
            // This is duplicating the Evaluate method on purpose
            // Do not modify this expression, segmentation engine doesn't like it
            return contact => contact.GetFacet<StringValueListFacet>(FacetId).Values.Any(key => key == EventIdFormatted);
        }
    }
}