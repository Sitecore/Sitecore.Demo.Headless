using Sitecore.ContentSearch;
using Sitecore.ContentSearch.ComputedFields;
using Sitecore.Data.Items;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Xml.Linq;

namespace Sitecore.HabitatHome.Fitness.Personalization.Indexing.ComputedFields
{
    public class ProfileNamesField : IComputedIndexField
    {
        public string FieldName { get; set; }
        public string ReturnType { get; set; }

        public object ComputeFieldValue(IIndexable indexable)
        {
            var item = (Item)(indexable as SitecoreIndexableItem);
            if (item != null && item["__Tracking"] != string.Empty)
            {
                return GetProfileNames(item["__Tracking"]).ToList();
            }
            return null;
        }

        public static IEnumerable<string> GetProfileNames(string xml)
        {
            var doc = XElement.Parse(xml);
            var elements =
                from el in doc.Elements()
                select el;


            foreach (XElement c in elements)
            {
                foreach (XElement profileEl in c.Elements())
                {
                    if (int.TryParse(profileEl.Attribute("value").Value, out int profileValue))
                    {
                        if (profileValue > 0)
                        {
                            yield return profileEl.Attribute("name").Value.ToLowerInvariant();
                        }
                    }
                }
            }
        }
    }
}