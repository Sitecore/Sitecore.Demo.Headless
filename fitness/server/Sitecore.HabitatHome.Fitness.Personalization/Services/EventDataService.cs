using Sitecore.Collections;
using Sitecore.Data;
using Sitecore.Data.Fields;
using Sitecore.Data.Items;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Sitecore.HabitatHome.Fitness.Personalization.Services
{
    /// <summary>
    /// Simple data service returning items in a given location by template
    /// IMPORTANT: this is not going to scale or perform on large content repositories
    /// it is intended to be simple and not search dependent
    /// </summary>
    public class EventDataService : IDataService
    {
        public IEnumerable<Item> GetAll([NotNull]Database database, [NotNull]Guid rootId, [NotNull]Guid templateId)
        {
            var rootItem = database.GetItem(new ID(rootId));

            if (rootItem == null)
            {
                return Enumerable.Empty<Item>();
            }

            return rootItem.Axes.GetDescendants()
                                .Where(eventItem => eventItem.TemplateID.Guid.Equals(templateId) &&
                                                    EventDateInFuture(eventItem))
                                .OrderBy(eventItem => eventItem[Wellknown.FieldIds.Events.Date]);
        }

        private bool EventDateInFuture([NotNull]Item item)
        {      
            var dateField = (DateField)item.Fields[Wellknown.FieldIds.Events.Date];
            return dateField == null ? false : Sitecore.DateUtil.ToUniversalTime(dateField.DateTime) >= DateTime.UtcNow;
        }
    }
}