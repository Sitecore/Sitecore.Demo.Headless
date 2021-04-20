using OrderCloud.SDK;

namespace Sitecore.Integrations.OrderCloud.Functions.Models.OrderCloud
{
    public class CatalogCategory : Category
    {
        // ReSharper disable once InconsistentNaming - Keeping consistency with SDK naming
        public string CatalogID { get; set; }
    }
}
