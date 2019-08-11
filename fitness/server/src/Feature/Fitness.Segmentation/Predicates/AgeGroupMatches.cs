using System;
using System.Linq.Expressions;
using Sitecore.Framework.Rules;
using Sitecore.XConnect;
using Sitecore.XConnect.Segmentation.Predicates;
using Sitecore.HabitatHome.Fitness.Collection.Model.Facets;

namespace Sitecore.HabitatHome.Fitness.Segmentation.Predicates
{
    public class AgeGroupMatches : ICondition, IContactSearchQueryFactory
    {
        public string AgeGroup { get; set; }

        public StringOperationType Comparison { get; set; }

        public bool Evaluate(IRuleExecutionContext context)
        {
            var contact = context.Fact<Contact>();
            return Comparison.Evaluate(AgeGroup, GetAgeGroup(contact));
        }

        public Expression<Func<Contact, bool>> CreateContactSearchQuery(IContactSearchQueryContext context)
        {
            return contact => Comparison.Evaluate(contact.GetFacet<DemographicsFacet>(DemographicsFacet.DefaultKey).AgeGroup, AgeGroup);
        }

        private string GetAgeGroup(Contact contact)
        {
            var facet = contact.GetFacet<DemographicsFacet>(DemographicsFacet.DefaultKey);
            return facet == null ? string.Empty : facet.AgeGroup;
        }
    }
}