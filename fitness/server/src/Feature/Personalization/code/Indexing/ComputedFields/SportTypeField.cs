using System.Collections.Generic;
using System.Linq;
using System.Xml.Linq;
using Sitecore.ContentSearch;
using Sitecore.ContentSearch.ComputedFields;
using Sitecore.Data.Items;
using System.Globalization;
using Sitecore.ContentSearch.Data;

namespace Sitecore.Demo.Fitness.Feature.Personalization.Indexing.ComputedFields
{
    public class SportTypeField : AbstractComputedIndexField
    {
        public override object ComputeFieldValue(IIndexable indexable)
        {
            Item item = indexable as SitecoreIndexableItem;
            if (item != null && item["sportType"] != string.Empty)
            {
                return item["sportType"];
            }
            return null;
        }
    }
}