using System.Collections.Generic;
using Sitecore.Data;
using Sitecore.Data.Items;

namespace Sitecore.Demo.Fitness.Feature.Personalization.Services
{
    public interface IProductDataService
    {
        IEnumerable<Item> GetAll(Database database);
    }
}