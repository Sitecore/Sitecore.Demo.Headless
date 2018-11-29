using Sitecore.ContentSearch;
using Sitecore.ContentSearch.ComputedFields;
using Sitecore.Data.Items;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Xml.Linq;

namespace Sitecore.HabitatHome.Fitness.Personalization.Indexing.ComputedFields
{
    public class TrackingField : IComputedIndexField
    {
        public string FieldName { get; set; }
        public string ReturnType { get; set; }

        public object ComputeFieldValue(IIndexable indexable)
        {
            var item = ((Item)(indexable as SitecoreIndexableItem));
            if (item != null && item["__Tracking"] != String.Empty)
            {
                var profiles = Parse(item["__Tracking"]);
                var profileList = new List<string>();

                foreach (var profile in profiles)
                {
                    foreach (var key in profile.Keys)
                    {
                        if (key.Value > 0)
                        {
                            if (!string.IsNullOrWhiteSpace(key.Name))
                            {
                                profileList.Add($"{key.Name}|{key.Value}");
                            }
                        }
                    }
                }

                if (profileList.Count == 0)
                {
                    return null;
                }

                return profileList;
            }

            return null;
        }

        public static List<Profile> Parse(string xml)
        {
            var doc = XElement.Parse(xml);
            var elements =
                from el in doc.Elements()
                select el;

            var profiles = new List<Profile>();

            foreach (XElement c in elements)
            {
                var profile = new Profile { Name = c.Attribute("name").Value, Keys = new List<ProfileKey>() };

                IEnumerable profileElements = from p in c.Elements()
                                              select profile;

                foreach (XElement p in profileElements)
                {
                    var profileKey = new ProfileKey { Name = p.Attribute("name").Value };
                    int.TryParse(p.Attribute("value").Value, out int k);
                    profileKey.Value = k;
                    profile.Keys.Add(profileKey);
                }
                profiles.Add(profile);
            }

            return profiles;
        }
    }

    public class Profile
    {
        public string Name { get; set; }
        public List<ProfileKey> Keys { get; set; }
    }

    public class ProfileKey
    {
        public string Name { get; set; }
        public int Value { get; set; }
    }
}