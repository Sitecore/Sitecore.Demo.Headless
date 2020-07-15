﻿using System.Collections.Generic;

namespace Sitecore.Demo.Fitness.Foundation.Analytics.Model
{
    public interface ISportPreferencesPayload
    {
        Dictionary<string, int> Ratings { get; set; }
        bool IsValid();
    }
}