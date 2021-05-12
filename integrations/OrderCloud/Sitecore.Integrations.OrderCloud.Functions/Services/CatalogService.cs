using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

using Microsoft.Extensions.Logging;

using OrderCloud.SDK;

using Sitecore.Integrations.OrderCloud.Functions.Models.Mappings;

using Stylelabs.M.Base.Querying;
using Stylelabs.M.Base.Querying.Filters;
using Stylelabs.M.Sdk.Contracts.Base;
using Stylelabs.M.Sdk.Contracts.Querying;
using Stylelabs.M.Sdk.WebClient;

namespace Sitecore.Integrations.OrderCloud.Functions.Services
{
    public class CatalogService
    {
        private readonly IWebMClient _webMClient;

        private readonly IOrderCloudClient _orderCloudClient;

        private readonly ILogger _log;

        private readonly ProductService _productService;

        private readonly MappingService _mappingService;

        public CatalogService(IWebMClient webMClient, IOrderCloudClient orderCloudClient, ILogger log)
        {
            _webMClient = webMClient;
            _orderCloudClient = orderCloudClient;
            _log = log;
            _productService = new ProductService(_webMClient, _orderCloudClient, _log);
            _mappingService = new MappingService(_webMClient, _log);
        }

        public async Task UpdateCatalog(long catalogId, string mappingIdentifier, long? productStatusIdFilter)
        {
            EntityMapping mapping = await _mappingService.GetMapping(mappingIdentifier);
            await UpdateCatalog(catalogId, mapping, productStatusIdFilter);
        }

        public async Task UpdateCatalog(long catalogId, EntityMapping mapping, long? productStatusIdFilter)
        {
            List<Task> productUpdateTasks = new List<Task>();
            Query q = new Query
                          {
                              Filter = new CompositeQueryFilter
                                           {
                                               CombineMethod = CompositeFilterOperator.And,
                                               Children = new List<QueryFilter>
                                                              {
                                                                  new RelationQueryFilter
                                                                      {
                                                                          Relation = "PCMCatalogToProduct",
                                                                          ParentId = catalogId
                                                                      },
                                                                  new RelationQueryFilter
                                                                      {
                                                                          Relation = "PCMProductStatusToProduct",
                                                                          ParentId = productStatusIdFilter
                                                                      }
                                                              }
                                           }
                          };
            IEntityIterator products = _webMClient.Querying.CreateEntityIterator(q);
            while (await products.MoveNextAsync())
            {
                foreach (IEntity product in products.Current.Items)
                {
                    if (product.Id.HasValue)
                    {
                        productUpdateTasks.Add(_productService.UpdateProduct(product.Id.Value, mapping.Clone() as EntityMapping));
                    }
                }
            }

            _log.LogInformation($"Sending {productUpdateTasks.Count} products to OC.");
            await Task.WhenAll(productUpdateTasks);
        }
    }
}
