using System;
using System.Linq.Expressions;
using Sitecore.Framework.Rules;
using Sitecore.XConnect;
using Sitecore.XConnect.Segmentation.Predicates;
using System.Linq;
using Sitecore.HabitatHome.Fitness.Collection.Model.Facets;
using Sitecore.HabitatHome.Fitness.Segmentation.Extensions;
using System.Reflection;
using System.Collections.Generic;

namespace Sitecore.HabitatHome.Fitness.Segmentation.Predicates
{
    public class SportsContains : ICondition, IContactSearchQueryFactory
    {
        public string SportName { get; set; }

        public StringOperationType Comparison { get; set; }

        public bool Evaluate(IRuleExecutionContext context)
        {
            var contact = context.Fact<Contact>();
            var sportNames = GetSportNames(contact);
            return Comparison.Evaluate(sportNames, SportName);
        }

        public Expression<Func<Contact, bool>> CreateContactSearchQuery(IContactSearchQueryContext context)
        {
            //return contact => contact.GetSportKeys().Contains(SportName);
            return GetContactPredicate(typeof(SportsFacet), SportsFacet.DefaultKey, "Ratings", SportName);
        }

        private static Expression<Func<Contact, bool>> GetContactPredicate(Type facetType, string facetKey, string propertyName, object value)
        {
            var contact = Expression.Parameter(typeof(Contact));
            var facet = Expression.Call(contact, "GetFacet", new[] { facetType }, Expression.Constant(facetKey));
            var facetProperty = Expression.Property(facet, propertyName);
            MethodInfo containsKeyMethod = typeof(Dictionary<string, int>).GetMethod("ContainsKey");
            return Expression.Lambda<Func<Contact, bool>>(Expression.Call(facetProperty, containsKeyMethod, Expression.Constant(value)), contact);
        }

        private string GetSportNames(Contact contact)
        {
            var sportFacet = contact.GetFacet<SportsFacet>(SportsFacet.DefaultKey);
            return sportFacet == null ? string.Empty : string.Join(",", sportFacet.Ratings.Keys.ToArray());
        }
    }
}