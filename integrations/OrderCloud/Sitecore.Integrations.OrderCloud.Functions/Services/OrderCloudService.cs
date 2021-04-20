using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

using OrderCloud.SDK;

using Sitecore.Integrations.OrderCloud.Functions.Models.Mappings;
using Sitecore.Integrations.OrderCloud.Functions.Models.OrderCloud;

namespace Sitecore.Integrations.OrderCloud.Functions.Services
{
    public class OrderCloudService
    {
        private static readonly Regex _AllExceptAlphanumericHyphenAndUnderscore = new Regex("[^a-z0-9-_]", RegexOptions.Compiled | RegexOptions.IgnoreCase | RegexOptions.Singleline | RegexOptions.CultureInvariant);

        private readonly ILogger _log;

        private readonly IOrderCloudClient _client;

        public OrderCloudService(IOrderCloudClient client, ILogger log)
        {
            _client = client;
            _log = log;
        }

        public void ProcessMapResult(MapResult mapResult)
        {
            SanitizeIds(mapResult);

            // OrderCloud Catalog Categories are not by assignment but direct parent-child relation
            List<CatalogCategory> categories = new List<CatalogCategory>();
            foreach (Catalog catalog in mapResult.Catalogs)
            {
                foreach (Category category in mapResult.Categories)
                {
                    CatalogCategory cc = new CatalogCategory();
                    cc.CatalogID = catalog.ID;
                    cc.ID = category.ID;
                    cc.Name = category.Name;
                    cc.Description = category.Description;
                    cc.ListOrder = category.ListOrder;
                    cc.Active = category.Active;
                    cc.ParentID = category.ParentID;
                    cc.xp = category.xp;
                    _log.LogInformation($"Adding {category.Name} to be processed");
                    categories.Add(cc);
                }
            }

            // If there's only 1 price schedule for the product simply use it as default
            if (mapResult.PriceSchedules.Count == 1)
            {
                mapResult.Product.DefaultPriceScheduleID = mapResult.PriceSchedules.Single().ID;
            }

            Save(mapResult.Catalogs, categories, mapResult.PriceSchedules, mapResult.ProductFacets, mapResult.Product);
        }

        private static void SanitizeIds(MapResult mapResult)
        {
            foreach (Catalog catalog in mapResult.Catalogs)
            {
                catalog.ID = SanitizeId(catalog.ID);
            }

            foreach (Category category in mapResult.Categories)
            {
                category.ID = SanitizeId(category.ID);
            }

            foreach (PriceSchedule schedule in mapResult.PriceSchedules)
            {
                schedule.ID = SanitizeId(schedule.ID);
            }

            foreach (ProductFacet facet in mapResult.ProductFacets)
            {
                facet.ID = SanitizeId(facet.ID);
            }

            mapResult.Product.ID = SanitizeId(mapResult.Product.ID);
        }

        private static string SanitizeId(string id)
        {
            return _AllExceptAlphanumericHyphenAndUnderscore.Replace(id, "_");
        }

        private void Save(ICollection<Catalog> catalogs, ICollection<CatalogCategory> categories, ICollection<PriceSchedule> priceSchedules, ICollection<ProductFacet> productFacets, Product product)
        {
            // Create/Update all catalogs
            List<Task> tasks = new List<Task>();
            foreach (Catalog catalog in catalogs)
            {
                tasks.Add(_client.Catalogs.SaveAsync(catalog.ID, catalog));
            }

            // Wait until all catalogs are created/updated before creating categories (they are hard-linked)
            Task.WaitAll(tasks.ToArray(), Timeout.Infinite);
            tasks = new List<Task>();

            // Create/Update all categories inside all catalogs
            foreach (CatalogCategory category in categories)
            {
                tasks.Add(_client.Categories.SaveAsync(category.CatalogID, category.ID, category));
            }

            // Create/Update all price schedules
            foreach (PriceSchedule priceSchedule in priceSchedules)
            {
                tasks.Add(_client.PriceSchedules.SaveAsync(priceSchedule.ID, priceSchedule));
            }

            // Create product
            tasks.Add(_client.Products.SaveAsync(product.ID, product));

            // Wait until all are created before doing assignments
            Task.WaitAll(tasks.ToArray(), Timeout.Infinite);
            tasks = new List<Task>();

            // Create all assignments
            foreach (Catalog catalog in catalogs)
            {
                ProductCatalogAssignment assignment = new ProductCatalogAssignment();
                assignment.CatalogID = catalog.ID;
                assignment.ProductID = product.ID;
                _log.LogInformation($"Adding product {product.ID}-{product.Name} to Catalog {assignment.CatalogID}");

                tasks.Add(_client.Catalogs.SaveProductAssignmentAsync(assignment));
            }

            foreach (CatalogCategory category in categories)
            {
                CategoryProductAssignment assignment = new CategoryProductAssignment();
                assignment.CategoryID = category.ID;
                assignment.ProductID = product.ID;
                _log.LogInformation($"Adding product {product.ID}-{product.Name} to Category {category.ID}-{category.Name}");
                tasks.Add(_client.Categories.SaveProductAssignmentAsync(category.CatalogID, assignment));
            }

            // We only need to make assignments if there's multiple schedules
            if (priceSchedules.Count > 1)
            {
                foreach (PriceSchedule priceSchedule in priceSchedules)
                {
                    ProductAssignment assignment = new ProductAssignment();
                    assignment.ProductID = product.ID;
                    assignment.PriceScheduleID = priceSchedule.ID;
                    tasks.Add(_client.Products.SaveAssignmentAsync(assignment));
                }
            }

            tasks.AddRange(productFacets.Select(facet => _client.ProductFacets.SaveAsync(facet.ID, facet)));

            // Wait until all assignments are created
            Task.WaitAll(tasks.ToArray(), Timeout.Infinite);
        }
    }
}
