using System.Globalization;
using Sitecore.Data.Items;
using Sitecore.ContentSearch;
using Sitecore.ContentSearch.ComputedFields;
using Sitecore.ContentSearch.Data;

namespace Sitecore.HabitatHome.Fitness.Personalization.Indexing.ComputedFields
{
    public class CoordinatesField : AbstractComputedIndexField
    {
        public override object ComputeFieldValue(IIndexable indexable)
        {
            Item item = indexable as SitecoreIndexableItem;
            if (item == null)
            {
                return null;
            }

            if (!item.Fields.Contains(Wellknown.FieldIds.Events.Latitude) ||
               !item.Fields.Contains(Wellknown.FieldIds.Events.Longitude))
            {
                return null;
            }

            if (!double.TryParse(item[Wellknown.FieldIds.Events.Latitude], NumberStyles.Any, CultureInfo.InvariantCulture, out double latitude) ||
                !double.TryParse(item[Wellknown.FieldIds.Events.Longitude], NumberStyles.Any, CultureInfo.InvariantCulture, out double longitude))
            {
                return null;
            }

            return new Coordinate(latitude, longitude).ToString();
        }
    }
}