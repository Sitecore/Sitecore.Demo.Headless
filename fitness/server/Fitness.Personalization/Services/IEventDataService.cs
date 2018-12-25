using Sitecore.Data;
using Sitecore.Data.Items;
using System.Collections.Generic;

namespace Sitecore.HabitatHome.Fitness.Personalization.Services
{
    public interface IEventDataService
    {
        IEnumerable<Item> GetAll(Database database, string[] profileNames, int take, int skip, float latitude, float longitude, out int totalSearchResults);
    }
}