using System.Collections.Generic;

using OrderCloud.SDK;

namespace Sitecore.Integrations.OrderCloud.Functions.Models.Mappings
{
    public class MapResult
    {
        public Product Product { get; set; } = new Product();

        public ICollection<Category> Categories { get; set; } = new List<Category>();

        public ICollection<Catalog> Catalogs { get; set; } = new List<Catalog>();

        public ICollection<PriceSchedule> PriceSchedules { get; set; } = new List<PriceSchedule>();

        public ICollection<ProductFacet> ProductFacets { get; set; } = new List<ProductFacet>();
    }
}
