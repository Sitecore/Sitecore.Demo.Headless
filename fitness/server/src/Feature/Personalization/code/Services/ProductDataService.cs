using System.Collections.Generic;
using System.Linq;
using Sitecore.Annotations;
using Sitecore.ContentSearch;
using Sitecore.ContentSearch.SearchTypes;
using Sitecore.ContentSearch.Security;
using Sitecore.Data;
using Sitecore.Data.Items;

namespace Sitecore.Demo.Fitness.Feature.Personalization.Services
{
    /// <summary>
    /// Service responsible for fetching product item data
    /// </summary>
    public class ProductDataService : IProductDataService
    {
        public IEnumerable<Item> GetAll([NotNull]Database database)
        {
            using (var context = GetIndex(database).CreateSearchContext(SearchSecurityOptions.DisableSecurityCheck))
            {
                return context.GetQueryable<SearchResultItem>()
                           .Where(i => i.TemplateId == Wellknown.TemplateIds.Product)
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