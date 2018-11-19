using System;
using System.Linq.Expressions;
using Sitecore.XConnect;
using Sitecore.XConnect.Segmentation.Predicates;
using Sitecore.HabitatHome.Fitness.Collection.Model.Facets;
using System.Reflection;
using System.Collections.Generic;

namespace Sitecore.HabitatHome.Fitness.Segmentation.Predicates
{
    public class SportsContains : IContactSearchQueryFactory
    {
        public string SportName { get; set; }

        public Expression<Func<Contact, bool>> CreateContactSearchQuery(IContactSearchQueryContext context)
        {
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
    }
}