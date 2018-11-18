using Sitecore.ContentSearch;
using Sitecore.ContentSearch.SearchTypes;
using Sitecore.ContentSearch.Security;
using Sitecore.Data;
using Sitecore.Data.Items;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Sitecore.HabitatHome.Fitness.Personalization.Services
{
    public class EventSearchResultItem : SearchResultItem
    {
        [IndexField("date")]
        public DateTime Date { get; set; }

        [IndexField("latitude")]
        public float Latitude { get; set; }

        [IndexField("longitude")]
        public float Longitude { get; set; }
    }

    /// <summary>
    /// Data Service responsible for fetching event items
    /// </summary>
    public class EventDataService : IEventDataService
    {
        public IEnumerable<Item> GetAll([NotNull]Database database)
        {
            using (var context = GetIndex(database).CreateSearchContext(SearchSecurityOptions.DisableSecurityCheck))
            {
                return context.GetQueryable<EventSearchResultItem>()
                           .Where(i => i.TemplateId == Wellknown.TemplateIds.Event)
                           .Where(i => i.Date > DateTime.UtcNow)
                           .OrderBy(i => i.Date)
                           .Select(i => i.GetItem())
                           .ToList();
            }
        }

        private ISearchIndex GetIndex([NotNull]Database database)
        {
            return ContentSearchManager.GetIndex($"sitecore_{database.Name}_index");
        }
    }
}