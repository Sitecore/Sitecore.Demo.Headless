using Sitecore.Data;
using Sitecore.Data.Items;
using System.Collections.Generic;

namespace Sitecore.HabitatHome.Fitness.Personalization.Services
{
    public interface IItemScoringService
    {
        IEnumerable<Item> ScoreItems([NotNull]IEnumerable<Item> items, [NotNull]Database database);
    }
}