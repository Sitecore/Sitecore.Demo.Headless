using Stylelabs.M.Sdk.Contracts.Base;

namespace Sitecore.Integrations.OrderCloud.Functions.Models.Mappings
{
    public class MapContext
    {
        public object ParentTarget { get; set; }

        public EntityMapping ParentMapping { get; set; }

        public IEntity ParentItem { get; set; }

        public MapContext ParentContext { get; set; }

        public int Index { get; set; }
    }
}
