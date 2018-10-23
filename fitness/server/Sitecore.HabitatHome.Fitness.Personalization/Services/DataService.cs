using Sitecore.Collections;
using Sitecore.Data;
using Sitecore.Data.Items;
using System.Collections.Generic;
using System.Linq;

namespace Sitecore.HabitatHome.Fitness.Personalization.Services
{
    /// <summary>
    /// Simple data service returning items in a given location by template
    /// IMPORTANT: this is not going to scale or perform on large content repositories
    /// it is intended to be simple and not search dependent
    /// </summary>
    public class DataService : IDataService
    {
        public IEnumerable<Item> GetAll([NotNull]Database database, [NotNull]ID templateId, [NotNull]ID rootId)
        {
            var rootItem = database.GetItem(rootId);

            if (rootItem == null)
            {
                return Enumerable.Empty<Item>();
            }

            return rootItem.GetChildren(ChildListOptions.IgnoreSecurity | ChildListOptions.SkipSorting)
             .Where(child => child.TemplateID.Equals(templateId));
        }
    }
}