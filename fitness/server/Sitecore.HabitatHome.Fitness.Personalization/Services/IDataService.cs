using Sitecore.Collections;
using Sitecore.Data;
using Sitecore.Data.Items;
using System.Collections.Generic;
using System.Linq;

namespace Sitecore.HabitatHome.Fitness.Personalization.Services
{
    public interface IDataService
    {
        IEnumerable<Item> GetAll(Database database, ID templateId, ID rootId);
    }
}