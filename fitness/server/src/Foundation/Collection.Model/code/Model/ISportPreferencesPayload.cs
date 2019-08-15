using System.Collections.Generic;

namespace Sitecore.HabitatHome.Fitness.Foundation.Collection.Model.Model
{
    public interface ISportPreferencesPayload
    {
        Dictionary<string, int> Ratings { get; set; }
        bool IsValid();
    }
}