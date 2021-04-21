using System;
using System.Collections.Generic;
using System.Linq;
using Sitecore.Annotations;
using Sitecore.ContentSearch;
using Sitecore.ContentSearch.Data;
using Sitecore.ContentSearch.Linq;
using Sitecore.ContentSearch.Linq.Utilities;
using Sitecore.ContentSearch.SearchTypes;
using Sitecore.ContentSearch.Security;
using Sitecore.Data;
using Sitecore.Data.Items;

namespace Sitecore.Demo.Fitness.Feature.Personalization.Services
{
    public class EventSearchResultItem : SearchResultItem
    {
        [IndexField("date")]
        public DateTime Date { get; set; }

        [IndexField("latitude")]
        public float Latitude { get; set; }

        [IndexField("longitude")]
        public float Longitude { get; set; }

        [IndexField("_profilenames")]
        public string ProfileNames { get; set; }

        [IndexField("coordinates")]
        public Coordinate EventLocation { get; set; }
    }

    /// <summary>
    /// Data Service responsible for fetching event items
    /// </summary>
    public class EventDataService : IEventDataService
    {
        public IEnumerable<Item> GetAll([NotNull]Database database, string[] profileNames, int take, int skip, double latitude, double longitude, out int totalSearchResults)
        {
            using (var context = GetIndex(database).CreateSearchContext(SearchSecurityOptions.DisableSecurityCheck))
            {
                // building query
                var query = PredicateBuilder.True<EventSearchResultItem>();

                var templateQuery = PredicateBuilder.True<EventSearchResultItem>();
                templateQuery = templateQuery.And(i => i.TemplateId == Wellknown.TemplateIds.Event);

                var parentQuery = PredicateBuilder.True<EventSearchResultItem>();
                parentQuery = parentQuery.And(i => i.Parent != Wellknown.ItemIds.SampleEventsFolder);

                var dateQuery = PredicateBuilder.True<EventSearchResultItem>();
                dateQuery = dateQuery.And(i => i.Date > DateTime.UtcNow);

                var profileNamesQuery = PredicateBuilder.True<EventSearchResultItem>();
                foreach (var profileName in profileNames)
                {
                    var profileNameValue = profileName.ToLowerInvariant();
                    profileNamesQuery = profileNamesQuery.Or(item => item.ProfileNames.Equals(profileNameValue));
                }

                // joining the queries
                query = query.And(templateQuery);
                query = query.And(parentQuery);
                query = query.And(dateQuery);
                query = query.And(profileNamesQuery);

                // building IQueryable
                var queryable = context.GetQueryable<EventSearchResultItem>()
                                            .Where(query);

                // TODO: consider nullable
                if (latitude !=0 && longitude != 0)
                {
                    queryable = queryable.OrderByDistance(s => s.EventLocation, new Coordinate(latitude, longitude));
                }

                if (take > -1)
                {
                    queryable = queryable.Take(take);
                }

                if (skip > -1)
                {
                    queryable = queryable.Skip(skip);
                }

                // getting the results
                var searchResults = queryable.GetResults();
                totalSearchResults = searchResults.TotalSearchResults;
                return searchResults.Select(i => i.Document.GetItem()).ToList();
            }
        }

        public Item GetById([NotNull]Database database, Guid itemId)
        {
            return database.GetItem(new ID(itemId));
        }

        private ISearchIndex GetIndex([NotNull]Database database)
        {
            return ContentSearchManager.GetIndex($"sitecore_{database.Name}_index");
        }
    }
}