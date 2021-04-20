using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;

namespace Sitecore.Integrations.OrderCloud.Functions.Models.Mappings
{
    public class Mapping : ICloneable
    {
        public Mapping()
        {
        }

        protected Mapping(Mapping copy)
        {
            From = copy.From;
            To = copy.To;
            Type = copy.Type;
            TargetType = copy.TargetType;
            RelationType = copy.RelationType;
            Culture = copy.Culture;
            Value = copy.Value;
            Facet = copy.Facet;
        }

        public string From { get; set; }

        public string To { get; set; }

        [DefaultValue(MappingType.Unknown)]
        public MappingType Type { get; set; }

        [DefaultValue(MappingTargetType.Unknown)]
        public MappingTargetType TargetType { get; set; }

        [DefaultValue(MappingRelationType.Unknown)]
        public MappingRelationType RelationType { get; set; }

        public string Culture { get; set; }

        public string Value { get; set; }

        public bool Facet { get; set; }

        public virtual object Clone()
        {
            return new Mapping(this);
        }

        protected static ICollection<T> Clone<T>(IEnumerable<T> copy) where T : Mapping
        {
            List<T> result = null;
            if (copy != null)
            {
                result = new List<T>();
                result.AddRange(copy.Where(m => m != null).Select(m => m.Clone() as T));
            }
            
            return result;
        }
    }
}
