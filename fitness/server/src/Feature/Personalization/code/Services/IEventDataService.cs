using System;
using System.Collections.Generic;
using Sitecore.Data;
using Sitecore.Data.Items;

namespace Sitecore.Demo.Fitness.Feature.Personalization.Services
{
    public interface IEventDataService
    {
        IEnumerable<Item> GetAll(Database database, string[] sportTypes, int take, int skip, double latitude, double longitude, out int totalSearchResults);

        Item GetById(Database database, Guid itemId);
    }
}