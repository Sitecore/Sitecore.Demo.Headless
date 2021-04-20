using System.Collections.Generic;

namespace Sitecore.Integrations.OrderCloud.Functions.Models.Mappings
{
    public class EntityMapping : Mapping
    {
        public EntityMapping()
        {
        }

        protected EntityMapping(EntityMapping copy)
            : base(copy)
        {
            PropertyMappings = Clone(copy.PropertyMappings);
            RelationMappings = Clone(copy.RelationMappings);
            ExtensionDataMappings = Clone(copy.ExtensionDataMappings);
        }

        public ICollection<Mapping> PropertyMappings { get; set; }

        public ICollection<EntityMapping> RelationMappings { get; set; }

        public ICollection<Mapping> ExtensionDataMappings { get; set; }

        public override object Clone()
        {
            return new EntityMapping(this);
        }
    }
}
