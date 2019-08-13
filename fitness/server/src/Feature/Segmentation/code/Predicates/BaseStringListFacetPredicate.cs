using System;
using System.Linq;
using System.Linq.Expressions;
using Sitecore.Framework.Rules;
using Sitecore.HabitatHome.Fitness.Foundation.Collection.Model.Facets;
using Sitecore.XConnect;
using Sitecore.XConnect.Segmentation.Predicates;

namespace Sitecore.HabitatHome.Fitness.Feature.Segmentation.Predicates
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